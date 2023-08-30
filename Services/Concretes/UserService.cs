using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ErrorModels;
using Entities.Exceptions;
using Entities.RelationModels;
using Repositories.Contracts;
using Repositories.Migrations;
using Services.Contracts;
using System.Collections.ObjectModel;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;

namespace Services.Concretes
{
	public class UserService : IUserService
	{
		private readonly IRepositoryManager _manager;
		private readonly IMapper _mapper;

		public UserService(IRepositoryManager manager
			, IMapper mapper)
		{
			_manager = manager;
			_mapper = mapper;
		}

		public async Task<UserDto> LoginAsync(UserDtoForLogin UserDtoL)
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

			#region convert user to userDto
			var userDto = _mapper.Map<UserDto>(user);

			var company = await _manager.CompanyRepository
				.GetCompanyByIdAsync(user.CompanyId, false);

			userDto.CompanyName = company.Name;
			userDto.RoleNames = await GetRoleNamesOfUserAsync(user.Id);
			#endregion

			return userDto;
		}

		public async Task<UserDto> RegisterAsync(UserDtoForRegister userDtoR)
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
				.GetRoleByNameAsync("User", false);

			// create
			_manager.UserAndRoleRepository
				.CreateUserAndRole(new UserAndRole()
				{
					UserId = user.Id,
					RoleId = role.Id
				});

			await _manager.SaveAsync();
			#endregion

			#region convert user to userDto
			var userDto = _mapper.Map<UserDto>(user);

			userDto.CompanyName = userDtoR.CompanyName;
			userDto.RoleNames = new Collection<string> { role.Name };
			#endregion

			return userDto;
		}

		private async Task ConflictControlAsync(
			Expression<Func<User, bool>> forWhichKeys
			, UserDtoForRegister userDtoR)
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

		private async Task<List<string>> GetRoleNamesOfUserAsync(Guid userId)
		{
			#region get userAndRoles
			var userAndRoles = await _manager.UserAndRoleRepository
				.GetUserAndRolesByUserIdAsync(userId, false);
			#endregion

			#region add roleNames to list
			var roleNames = new List<string>();
			Role role;

			foreach (var userAndRole in userAndRoles)
			{
				// get role	
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
	}
}