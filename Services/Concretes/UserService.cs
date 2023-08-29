using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ErrorModels;
using Entities.Exceptions;
using Entities.RelationModels;
using Repositories.Contracts;
using Services.Contracts;
using System.Linq.Expressions;


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
			if (!user.Password.Equals(UserDtoL.Password))
				throw new ErrorWithCodeException(404,
					"VE-P",
					"Verification Error - Password");
			#endregion

			#region convert user to userDto
			var userDto = _mapper.Map<UserDto>(user);

			userDto.RoleNames = await GetRoleNamesOfUserAsync(user.Id);

			#region add company name
			var company = await _manager.CompanyRepository
				.GetCompanyByIdAsync(user.CompanyId, false);

			userDto.CompanyName = company.Name;
			#endregion

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

			#region add companyId to user
			var user = _mapper.Map<User>(userDtoR);

			var company = await _manager.CompanyRepository
				.GetCompanyByNameAsync(userDtoR.CompanyName, false);

			#region create company if not exists on database
			if (company == null)
			{
				company = new Company() { Name = userDtoR.CompanyName };

				_manager.CompanyRepository
					.CreateCompany(company);

				await _manager.SaveAsync();
			}
			#endregion

			user.CompanyId = company.Id;
			#endregion

			#region create user
			_manager.UserRepository
				.CreateUser(user);

			await _manager.SaveAsync();
			#endregion

			#region create userAndRole
			// get role
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
			userDto.RoleNames = new List<string>() { role.Name };
			#endregion

			return userDto;
		}

		public async Task<bool> IsEmailSyntaxValidAsync(string email) =>
			await Task.Run(() =>
			{
				#region '@' control
				var index = email.IndexOf('@');

				// when not contains '@'
				if (index == -1)
					return false;
				#endregion

				#region '.' control
				var emailExtension = email.Substring(index + 1);  // ex: gmail.com

				// when not contains '.'
				if (!emailExtension.Contains('.'))
					return false;
				#endregion

				return true;
			});

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
	}
}


//public async Task FormatControlAsync(UserDtoForLogin viewModel)
//{
//	#region set default error model
//	var errorModel = new ErrorDetails()
//	{
//		StatusCode = 400,
//		ErrorCode = "FE-",
//		ErrorDescription = "Formet Error - ",
//		Message = "Format Error - "
//	};
//	#endregion

//	#region firstName control
//	if (viewModel.FirstName != null
//		&& viewModel.FirstName.Length > _userConfig.FirstNameMaxLength)
//		UpdateErrorCode(ref errorModel,
//			"F",
//			"FirstName ",
//			$"FirstName:{viewModel.FirstName} ");
//	#endregion

//	#region lastName control
//	if (viewModel.LastName != null
//		&& viewModel.LastName.Length > _userConfig.LastNameMaxLength)
//		UpdateErrorCode(ref errorModel,
//			"L",
//			"LastName ",
//			$"LastName:{viewModel.LastName} ");
//	#endregion

//	#region companyName control
//	if (viewModel.CompanyName != null
//		&& viewModel.CompanyName.Length > _userConfig.CompanyNameMaxLength)
//		UpdateErrorCode(ref errorModel,
//			"C",
//			"CompanyName ",
//			$"CompanyName:{viewModel.CompanyName} ");
//	#endregion

//	#region telNo control
//	if (viewModel.TelNo != null
//		&& !await IsTelNoSyntaxValidAsync(viewModel.TelNo))
//		UpdateErrorCode(ref errorModel,
//			"T",
//			"TelNo ",
//			$"TelNo:{viewModel.TelNo} ");
//	#endregion

//	#region email control
//	if (viewModel.Email != null
//		&& !await IsEmailSyntaxValidAsync(viewModel.Email))
//		UpdateErrorCode(ref errorModel,
//			"E",
//			"Email ",
//			$"Email:{viewModel.Email} ");
//	#endregion

//	#region password control
//	if (viewModel.Password != null
//		&& !await IsPasswordSyntaxValidAsync(viewModel.Password))
//		UpdateErrorCode(ref errorModel,
//			"P",
//			"Password ",
//			$"Password:{viewModel.Password} ");
//	#endregion

//	#region throw format error
//	if (!errorModel.ErrorCode.Equals("FE-"))
//	{
//		// do trim to end
//		errorModel.ErrorDescription = errorModel.ErrorDescription.TrimEnd();
//		errorModel.Message = errorModel.Message.TrimEnd();

//		throw new ErrorWithCodeException(errorModel);
//	}
//	#endregion
//}


//public async Task<bool> IsTelNoSyntaxValidAsync(string telNo) =>
//			await Task.Run(() =>
//			{
//				#region length control
//				if (telNo.Length != _userConfig.TelNoLength)
//					return false;
//				#endregion

//				return true;
//			});

//public async Task<bool> IsPasswordSyntaxValidAsync(string password) =>
//	await Task.Run(() =>
//	{
//		#region length control
//		if (password.Length < _userConfig.PasswordMinLength  // min len
//			|| password.Length > _userConfig.PasswordMaxLength) // max len
//			return false;
//		#endregion

//		return true;
//	});