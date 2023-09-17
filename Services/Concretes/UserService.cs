using AutoMapper;
using Entities.ConfigModels.Contracts;
using Entities.DataModels;
using Entities.DataModels.RelationModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Entities.Exceptions;
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

		public async Task<string> LoginAsync(UserBodyDtoForLogin UserDtoL)
		{
			#region get user by telNo
			var user = await _manager.UserRepository
				.GetUserByTelNoAsync(UserDtoL.TelNo, false);
			#endregion

			#region when telNo not found (throw)
			_ = user ?? throw new ErrorWithCodeException(404,
				"VE-U-T",
				"Verification Error - Telephone");
			#endregion

			#region when password is wrong (throw)
			var hashedPassword = await ComputeMd5Async(UserDtoL.Password);

			if (!user.Password.Equals(hashedPassword))
				throw new ErrorWithCodeException(404,
					"VE-U-P",
					"Verification Error - Password");
			#endregion

			return await GenerateTokenForUserAsync(user);
		}

		public async Task RegisterAsync(UserBodyDtoForRegister userDtoR)
		{
			#region control conflict errors
			var userDtoC = _mapper.Map<UserDtoForConflictControl>(userDtoR);

			await ConflictControlAsync(u =>
				u.TelNo.Equals(userDtoC.TelNo)  // telNo
				|| u.Email.Equals(userDtoC.Email)  // email
				, userDtoC);
			#endregion

			#region convert userDtoR to user
			var company = await
				GetCompanyAndCreateIfNotExistsAsync(userDtoR.CompanyName);

			// convert
			var user = _mapper.Map<User>(userDtoR);
			user.CompanyId = company.Id;
			user.Password = await ComputeMd5Async(userDtoR.Password);
			user.CreatedAt = DateTime.UtcNow;
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

		public async Task CreateUserAsync(UserBodyDtoForCreate userDtoC)
		{
			#region control conflict error
			var userDtoConf = _mapper.Map<UserDtoForConflictControl>(userDtoC);

			await ConflictControlAsync(u =>
				u.Email.Equals(userDtoConf.Email)
				|| u.TelNo.Equals(userDtoConf.TelNo)
				, userDtoConf);
			#endregion

			#region convert userDtoC to user
			var company = await GetCompanyAndCreateIfNotExistsAsync(userDtoC.CompanyName);

			var user = _mapper.Map<User>(userDtoC);
			user.CompanyId = company.Id;
			user.Password = await ComputeMd5Async(userDtoC.Password);
			user.CreatedAt = DateTime.UtcNow;
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
			PaginationQueryDto pagingParameters, HttpResponse response)
		{
			#region when user not found (throw)
			var users = await _manager.UserRepository
				.GetAllUsersAsync(pagingParameters);

			if (users.Count == 0)
				throw new ErrorWithCodeException(404, 
					"NF-U-U", 
					"Not Found - User");
			#endregion

			#region convert user to userDto
			var userDtos = await _dtoConverterService
				.UserToUserDtoAsync(users);
			#endregion

			#region add pagination details to headers
			response.Headers.Add(
				"User-Pagination", 
				users.GetMetaDataForHeaders());
			#endregion

			return userDtos;
		}

		public async Task UpdateUserAsync(string email, UserBodyDtoForUpdate userDtoU)
		{
			#region control conflict error
			var userDtoC = _mapper.Map<UserDtoForConflictControl>(userDtoU);

			// if values null, then they didn't change.
			await ConflictControlAsync(u =>
				u.TelNo == null ? true : u.TelNo == userDtoU.TelNo
				|| u.Email == null ? true : u.Email == userDtoU.Email,
				userDtoC);
			#endregion

			#region when user not found (throw)
			var user = await _manager.UserRepository
				.GetUserByEmailAsync(email);

			if (user == null)
				throw new ErrorWithCodeException(404,
					"VE-U-E",
					"Verification Error - Email");
			#endregion

			#region get company
			var company = userDtoU.CompanyName == null ?
				null  // if company name not updated
				: await GetCompanyAndCreateIfNotExistsAsync(userDtoU.CompanyName);
			#endregion

			#region update user
			user.FirstName = userDtoU.FirstName ?? user.FirstName;
			user.LastName = userDtoU.LastName ?? user.LastName;
			user.TelNo = userDtoU.TelNo ?? user.TelNo;
			user.CompanyId = company == null ? user.CompanyId : company.Id;
			user.Email = userDtoU.Email ?? user.Email;

			_manager.UserRepository.Update(user);
			#endregion

			#region create&delete userAndRole
			if (userDtoU.RoleNames != null)
			{
				#region delete userAndRole that not exists userDto
				var userAndRoles = await _manager.UserAndRoleRepository
					.GetUserAndRolesByUserIdAsync(user.Id);

				#region delete UserAndRole 
				var roleNamesInDatabase = new Collection<string>();

				foreach (var userAndRole in userAndRoles)
				{
					#region get role
					var role = await _manager.RoleRepository
						.GetRoleByIdAsync(userAndRole.RoleId);

					roleNamesInDatabase.Add(role.Name);
					#endregion

					#region when exists database but not exists current data
					if (!userDtoU.RoleNames.Contains(role.Name))
						_manager.UserAndRoleRepository
							.Delete(userAndRole);
					#endregion
				}
				#endregion

				#endregion

				#region create userAndRole that not exists database
				foreach (var roleNameInDto in userDtoU.RoleNames)
				{
					// when not exists database but exists userDto
					if (!roleNamesInDatabase.Contains(roleNameInDto))
					{
						#region get role
						var role = await _manager.RoleRepository
							.GetRoleByNameAsync(roleNameInDto);
						#endregion

						#region create userAndRole
						_manager.UserAndRoleRepository
							.Create(new UserAndRole
							{
								UserId = user.Id,
								RoleId = role.Id
							});
						#endregion
					}
				}
				#endregion
			}

			await _manager.SaveAsync();
			#endregion
		}

		public async Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD)
		{
			#region delete users
			var IsFalseTelNoExists = false;

			foreach (var telNo in userDtoD.TelNos)
			{
				#region get user by telNo
				var user = await _manager.UserRepository
					.GetUserByTelNoAsync(telNo);
				#endregion

				#region when telNo not found
				if (user == null)
				{
					IsFalseTelNoExists = true;
					break;
				}
				#endregion

				#region delete user
				_manager.UserRepository
					.Delete(user);
				#endregion

				#region delete userAndRoles of user
				var userAndRoles = await _manager.UserAndRoleRepository
					.GetUserAndRolesByUserIdAsync(user.Id);

				userAndRoles.ForEach(userAndRole =>
					_manager.UserAndRoleRepository
						.Delete(userAndRole)
				);
				#endregion
			}
			#endregion

			#region when any telNo not Found (throw)
			if (IsFalseTelNoExists)
				throw new ErrorWithCodeException(409,
					"VE-U-T",
					"Verification Error - Telephone");
			#endregion

			await _manager.SaveAsync();
		}


		#region private

		private async Task ConflictControlAsync(
			Expression<Func<User, bool>> condition,
			UserDtoForConflictControl userDtoC)
		{
			#region get users
			var users = await _manager.UserRepository
				.GetUsersByConditionAsync(condition);
			#endregion

			#region control conflict error
			if (users.Count != 0)
			{
				var errorCode = "CE-";
				var errorDescription = "Conflict Error - ";

				#region control telNo
				if (users.Any(u => u.TelNo.Equals(userDtoC.TelNo)))
				{
					errorCode += "T";
					errorDescription += "TelNo ";
				}
				#endregion

				#region control email
				if (users.Any(u => u.Email.Equals(userDtoC.Email)))
				{
					errorCode += "E";
					errorDescription += "Email ";
				}
				#endregion

				#region throw exception
				errorDescription = errorDescription.TrimEnd();

				throw new ErrorWithCodeException(409, errorCode, errorDescription);
				#endregion
			}
			#endregion
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

		private async Task<string> GenerateTokenForUserAsync(User user)
		{
			#region set claims
			var claims = new Collection<Claim>
			{
				new Claim("Id", user.Id.ToString()),
				new Claim("firstName", user.FirstName),
				new Claim("LastName", user.LastName)
			};

			#region add roles
			var roleNames = await GetRoleNamesOfUserAsync(user.Id);

			foreach (var roleName in roleNames)
				claims.Add(new Claim("Role", roleName));
			#endregion

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