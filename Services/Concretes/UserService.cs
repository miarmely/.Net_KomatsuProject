using AutoMapper;
using Entities.ConfigModels.Contracts;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ErrorModels;
using Entities.Exceptions;
using Entities.QueryModels;
using Entities.RelationModels;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Repositories.Contracts;
using Services.Contracts;
using System.Collections.ObjectModel;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Services.Concretes
{
    public class UserService : IUserService
	{
		private readonly IRepositoryManager _manager;
		private readonly IConfigManager _config;
		private readonly IMapper _mapper;
		private readonly IDtoConverterService _dtoConverterService;

		public UserService(IRepositoryManager manager,
			IConfigManager config,
			IMapper mapper,
			IDtoConverterService dtoConverterService)
		{
			_manager = manager;
			_config = config;
			_mapper = mapper;
			_dtoConverterService = dtoConverterService;
		}

		public async Task<string> LoginAsync(UserDtoForLogin UserDtoL)
		{
			#region get user by telNo
			var user = await _manager.UserRepository
				.GetUserByTelNoAsync(UserDtoL.TelNo, false);
			#endregion

			#region when telNo not found (throw)
			_ = user ?? throw new ErrorWithCodeException(404,
				"VE-T",
				"Verification Error - Telephone");
			#endregion

			#region when password is wrong (throw)
			var hashedPassword = await ComputeMd5Async(UserDtoL.Password);

			if (!user.Password.Equals(hashedPassword))
				throw new ErrorWithCodeException(404,
					"VE-P",
					"Verification Error - Password");
			#endregion

			return await GenerateTokenForUserAsync(user.Id);
		}

		public async Task RegisterAsync(UserDtoForRegister userDtoR)
		{
			#region control conflict errors
			var userDto = _mapper.Map<UserDto>(userDtoR);

			await ConflictControlAsync(u =>
				u.TelNo.Equals(userDto.TelNo)  // telNo
				|| u.Email.Equals(userDto.Email)  // email
				, userDto);
			#endregion

			#region convert userDtoR to user
			var company = await GetCompanyAndCreateIfNotExistsAsync(userDtoR.CompanyName);
			
			var user = _mapper.Map<User>(userDtoR);
			user.CompanyId = company.Id;
			user.Password = await ComputeMd5Async(userDtoR.Password);
			#endregion

			#region create user
			_manager.UserRepository
				.Create(user);

			await _manager.SaveAsync();
			#endregion

			#region create userAndRole
			// get "User" role
			var role = await _manager.RoleRepository
				.GetRoleByNameAsync("User", false);

			// create,
			var entity = new UserAndRole()
			{
				UserId = user.Id,
				RoleId = role.Id
			};

			_manager.UserAndRoleRepository
				.Create(entity);

			await _manager.SaveAsync();
			#endregion
		}

		public async Task CreateUserAsync(UserDtoForCreate userDtoC)
		{
			#region control conflict error
			var userDto = _mapper.Map<UserDto>(userDtoC);

			await ConflictControlAsync(u =>
				u.Email.Equals(userDto.Email)
				|| u.TelNo.Equals(userDto.TelNo)
				, userDto);
			#endregion

			#region convert userDtoC to user
			var company = await GetCompanyAndCreateIfNotExistsAsync(userDtoC.CompanyName);
		
			var user = _mapper.Map<User>(userDtoC);
			user.CompanyId = company.Id;
			user.Password = await ComputeMd5Async(userDtoC.Password);
			#endregion

			#region create user
			_manager.UserRepository
				.Create(user);

			await _manager.SaveAsync();
			#endregion

			#region create userAndRole
			var role = await _manager.RoleRepository
				.GetRoleByNameAsync(userDtoC.RoleName, false);

			_manager.UserAndRoleRepository
				.Create(new UserAndRole
				{
					UserId = user.Id,
					RoleId = role.Id
				});

			await _manager.SaveAsync();
			#endregion
		}
		
		public async Task<ICollection<UserDto>> GetAllUsersWithPagingAsync(
			PagingParameters pagingParameters, HttpResponse response)
		{
			#region when user not found (throw)
			var users = await _manager.UserRepository
				.GetAllUsersAsync(pagingParameters);

			if (users.Count == 0)
				throw new ErrorWithCodeException(404, "NF-U", "Not Found - User");
			#endregion

			#region convert user to userDto
			var userDtos = await _dtoConverterService
				.UserToUserDtoAsync(users);
			#endregion

			#region add pagination details to headers
			var metaData = new
			{
				users.TotalPage,
				users.TotalCount,
				users.CurrentPage,
				users.PageSize,
				users.HasPrevious,
				users.HasNext
			};

			response.Headers.Add("User-Pagination", JsonSerializer.Serialize(metaData));
			#endregion

			return userDtos;
		}


		#region private

		private async Task ConflictControlAsync(
			Expression<Func<User, bool>> condition,
			UserDto userDto)
		{
			#region get users
			var users = await _manager.UserRepository
				.GetUsersByConditionAsync(condition);
			#endregion

			#region control conflict error
			if (users.Count != 0)
			{
				var errorModel = new ErrorDetails()
				{
					StatusCode = 409,
					ErrorCode = "CE-",
					ErrorDescription = "Conflict Error - ",
				};

				#region control telNo
				if (users.Any(u => u.TelNo.Equals(userDto.TelNo)))
					UpdateErrorCode(ref errorModel, "T", "TelNo ");
				#endregion

				#region control email
				if (users.Any(u => u.Email.Equals(userDto.Email)))
					UpdateErrorCode(ref errorModel, "E", "Email ");
				#endregion

				#region throw exception
				errorModel.ErrorDescription = errorModel.ErrorDescription.TrimEnd();

				throw new ErrorWithCodeException(errorModel);
				#endregion
			}
			#endregion
		}

		private void UpdateErrorCode(ref ErrorDetails errorModel
			, string newErrorCode
			, string newErrorDescription)
		{
			errorModel.ErrorCode += newErrorCode;
			errorModel.ErrorDescription += newErrorDescription;
		}

		private async Task<ICollection<string>> GetRoleNamesOfUserAsync(Guid userId)
		{
			#region get userAndRoles
			var userAndRoles = await _manager.UserAndRoleRepository
				.GetUserAndRolesByUserIdAsync(userId, false);
			#endregion

			#region add roleNames to collection
			var roleNames = new Collection<string>();
			Role role;

			foreach (var userAndRole in userAndRoles)
			{
				role = await _manager.RoleRepository
					.GetRoleByIdAsync(userAndRole.RoleId, false);

				roleNames.Add(role.Name);
			}
			#endregion

			return roleNames;
		}

		private async Task<string> ComputeMd5Async(string input) =>
			await Task.Run(() =>
			{
				using (var md5 = MD5.Create())
				{
					#region hash to input
					var hashAsByte = md5.ComputeHash(Encoding.UTF8
						.GetBytes(input));

					var hashAsString = Convert.ToBase64String(hashAsByte);
					#endregion

					return hashAsString;
				}
			});

		private async Task<string> GenerateTokenForUserAsync(Guid userId)
		{
			#region set claims
			var claims = new Collection<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, userId.ToString())  // add userId
			};
			var roleNames = await GetRoleNamesOfUserAsync(userId);

			// add roles
			foreach (var roleName in roleNames)
				claims.Add(new Claim(ClaimTypes.Role, roleName));
			#endregion

			#region set signingCredentials
			var secretKeyInBytes = Encoding.UTF8
					.GetBytes(_config.JwtSettings.SecretKey);

			var signingCredentials = new SigningCredentials(
				new SymmetricSecurityKey(secretKeyInBytes),
				SecurityAlgorithms.HmacSha256);
			#endregion

			#region set token
			var token = new JwtSecurityToken(
				issuer: _config.JwtSettings.ValidIssuer,
				audience: _config.JwtSettings.ValidAudience,
				claims: claims,
				expires: DateTime.Now.AddMinutes(_config.JwtSettings.Expires),
				signingCredentials: signingCredentials);
			#endregion

			return new JwtSecurityTokenHandler()
				.WriteToken(token);
		}

		private async Task<Company> GetCompanyAndCreateIfNotExistsAsync(string companyName)
		{
			#region get company
			var company = await _manager.CompanyRepository
				.GetCompanyByNameAsync(companyName, false);
			#endregion

			#region create company if not exists on database
			if (company == null)
			{
				company = new Company()
				{
					Name = companyName
				};

				_manager.CompanyRepository
					.Create(company);

				await _manager.SaveAsync();
			}
			#endregion

			return company;
		}

		#endregion
	}
}