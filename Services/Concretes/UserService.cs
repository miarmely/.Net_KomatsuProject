using AutoMapper;
using Entities.ConfigModels;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ErrorModels;
using Entities.Exceptions;
using Entities.RelationModels;
using Microsoft.Extensions.Options;
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
		private readonly IMapper _mapper;
		private readonly JwtSettingsConfig _jwtSettings;

		public UserService(IRepositoryManager manager
			, IMapper mapper
			, IOptions<JwtSettingsConfig> jwtSettings)
		{
			_manager = manager;
			_mapper = mapper;
			_jwtSettings = jwtSettings.Value;
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

			return await CreateTokenForUserAsync(user.Id);
		}

		public async Task RegisterAsync(UserDtoForRegister userDtoR)
		{
			#region control conflict errors
			await ConflictControlAsync(u =>
				u.TelNo.Equals(userDtoR.TelNo)
				|| u.Email.Equals(userDtoR.Email)
				, userDtoR);
			#endregion

			#region get company
			var company = await _manager.CompanyRepository
				.GetCompanyByNameAsync(userDtoR.CompanyName, false);

			#region create company if not exists on database
			if (company == null)
			{
				company = new Company()
				{
					Name = userDtoR.CompanyName
				};

				_manager.CompanyRepository
					.CreateCompany(company);

				await _manager.SaveAsync();
			}
			#endregion

			#endregion

			#region convert userDtoR to user
			var user = _mapper.Map<User>(userDtoR);

			user.CompanyId = company.Id;
			user.Password = await ComputeMd5Async(user.Password);
			#endregion

			#region create user
			_manager.UserRepository
				.CreateUser(user);

			await _manager.SaveAsync();
			#endregion

			#region create userAndRole
			var role = await _manager.RoleRepository
				.GetRoleByNameAsync("Admin", false);

			// create
			_manager.UserAndRoleRepository
				.CreateUserAndRole(new UserAndRole()
				{
					UserId = user.Id,
					RoleId = role.Id
				});

			await _manager.SaveAsync();
			#endregion
		}

		private async Task ConflictControlAsync(
			Expression<Func<User, bool>> forWhichKeys,
			UserDtoForRegister userDtoR)
		{
			#region get users
			var users = await _manager.UserRepository
				.GetUsersByConditionAsync(forWhichKeys, false);
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

				#region when telNo already exists
				if (users.Any(u => u.TelNo.Equals(userDtoR.TelNo)))
					UpdateErrorCode(ref errorModel, "T", "TelNo ");
				#endregion

				#region when email already exists
				if (users.Any(u => u.Email.Equals(userDtoR.Email)))
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
					// hash to input
					var hash = md5.ComputeHash(Encoding.UTF8
								.GetBytes(input));

					// convert byte[] to string
					var hashedInput = BitConverter
						.ToString(hash)
						.Replace("-", "");

					return hashedInput;
				}
			});

		private async Task<string> CreateTokenForUserAsync(Guid userId)
		{
			#region set claims
			var claims = new Collection<Claim>
			{
				new Claim(ClaimTypes.Name, userId.ToString())  // add userId
			};
			var roleNames = await GetRoleNamesOfUserAsync(userId);

			// add roles
			foreach (var roleName in roleNames)
				claims.Add(new Claim(ClaimTypes.Role, roleName));
			#endregion

			#region set signingCredentials
			var encodedKey = Encoding.UTF8
					.GetBytes(_jwtSettings.SecretKey);

			var signingCredentials = new SigningCredentials(
				new SymmetricSecurityKey(encodedKey),
				SecurityAlgorithms.HmacSha256);
			#endregion

			#region set token
			var token = new JwtSecurityToken(
				issuer: _jwtSettings.ValidIssuer,
				audience: _jwtSettings.ValidAudience,
				claims: claims,
				expires: DateTime.Now.AddMinutes(_jwtSettings.Expires),
				signingCredentials: signingCredentials);
			#endregion

			return new JwtSecurityTokenHandler()
				.WriteToken(token);
		}
	}
}