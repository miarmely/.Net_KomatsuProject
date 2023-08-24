using AutoMapper;
using Entities.ConfigModels;
using Entities.DataModels;
using Entities.ErrorModels;
using Entities.Exceptions;
using Entities.ViewModels;
using Microsoft.Extensions.Options;
using Repositories.Contracts;
using Services.Contracts;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

namespace Services.Concretes
{
	public class UserService : IUserService
	{
		private readonly IRepositoryManager _manager;

		private readonly IMapper _mapper;

		private readonly UserSettingsConfig _userConfig;

		public UserService(IRepositoryManager manager
			, IOptions<UserSettingsConfig> userConfig
			, IMapper mapper)
		{
			_manager = manager;
			_userConfig = userConfig.Value;
			_mapper = mapper;
		}

		public async Task<UserView> LoginAsync(UserView viewModel)
		{
			await FormatControlAsync(viewModel);

			#region get user by telNo
			var user = await _manager.UserRepository
				.GetUserByTelNoAsync(viewModel.TelNo, false);
			#endregion

			#region when telNo not found
			_ = user ?? throw new ErrorWithCodeException(404,
				"VE-T",
				"Verification Error - Telephone",
				$"Telephone not found. -> telephone:{viewModel.TelNo}");
			#endregion

			#region when password is wrong
			if (!user.Password.Equals(viewModel.Password))
				throw new ErrorWithCodeException(404,
					"VE-P",
					"Verification Error - Password",
					$"Password not found. -> telNo:{viewModel.TelNo} && password:{viewModel.Password}");
			#endregion

			#region convert user to userView
			var userView = _mapper.Map<UserView>(user);

			var company = await _manager.CompanyRepository
				.GetCompanyByIdAsync(user.CompanyId, false);

			userView.CompanyName = company.Name;
			#endregion

			return userView;
		}

		public async Task<UserView> RegisterAsync(UserView viewModel)
		{
			#region control format and conflict errors
			await FormatControlAsync(viewModel);

			await ConflictControlAsync(u =>
				u.TelNo.Equals(viewModel.TelNo)
				|| u.Email.Equals(viewModel.Email)
				, viewModel);
			#endregion

			#region create company if not exists
			var company = await _manager.CompanyRepository
				.GetCompanyByNameAsync(viewModel.CompanyName, false);

			#region when company name not found 
			if (company == null)
			{
				company = new Company()
				{
					Name = viewModel.CompanyName
				};

				#region create company
				_manager.CompanyRepository
					.CreateCompany(company);

				await _manager.SaveAsync();
				#endregion
			}
			#endregion

			#endregion

			#region convert userView to user
			var user = _mapper.Map<User>(viewModel);

			user.CompanyId = company.Id;
			#endregion

			#region create user
			_manager.UserRepository
				.CreateUser(user);

			await _manager.SaveAsync();

			viewModel.Id = user.Id;
			#endregion

			return viewModel;
		}

		public async Task<bool> IsEmailSyntaxValidAsync(string email) =>
			await Task.Run(() =>
			{
				#region '@' control
				var index = email.IndexOf('@');

				if (index == -1)
					return false;
				#endregion

				#region '.' control
				var emailExtension = email.Substring(index + 1);  // ex: gmail.com

				if (!emailExtension.Contains('.'))
					return false;
				#endregion

				return true;
			});

		public async Task<bool> IsTelNoSyntaxValidAsync(string telNo) =>
			await Task.Run(() =>
			{
				#region length control
				if (telNo.Length != _userConfig.TelNoLength)
					return false;
				#endregion

				return true;
			});

		public async Task<bool> IsPasswordSyntaxValidAsync(string password) =>
			await Task.Run(() =>
			{
				#region length control
				if (password.Length < _userConfig.PasswordMinLength  // min len
					|| password.Length > _userConfig.PasswordMaxLength) // max len
					return false;
				#endregion

				return true;
			});

		public async Task FormatControlAsync(UserView viewModel)
		{
			var errorModel = new ErrorWithCode()
			{
				StatusCode = 400,
				ErrorCode = "FE-",
				ErrorDescription = "Formet Error - ",
				Message = "Format Error - "
			};

			#region firstName control
			if (viewModel.FirstName != null
				&& viewModel.FirstName.Length > _userConfig.FirstNameMaxLength)
				UpdateErrorCode(ref errorModel,
					"F",
					"FirstName ",
					$"FirstName:{viewModel.FirstName} ");
			#endregion

			#region lastName control
			if (viewModel.LastName != null
				&& viewModel.LastName.Length > _userConfig.LastNameMaxLength)
				UpdateErrorCode(ref errorModel,
					"L",
					"LastName ",
					$"LastName:{viewModel.LastName} ");
			#endregion

			#region companyName control
			if (viewModel.CompanyName != null
				&& viewModel.CompanyName.Length > _userConfig.CompanyNameMaxLength)
				UpdateErrorCode(ref errorModel,
					"C",
					"CompanyName ",
					$"CompanyName:{viewModel.CompanyName} ");
			#endregion

			#region telNo control
			if (viewModel.TelNo != null
				&& !await IsTelNoSyntaxValidAsync(viewModel.TelNo))
				UpdateErrorCode(ref errorModel,
					"T",
					"TelNo ",
					$"TelNo:{viewModel.TelNo} ");
			#endregion

			#region email control
			if (viewModel.Email != null
				&& !await IsEmailSyntaxValidAsync(viewModel.Email))
				UpdateErrorCode(ref errorModel,
					"E",
					"Email ",
					$"Email:{viewModel.Email} ");
			#endregion

			#region password control
			if (viewModel.Password != null
				&& !await IsPasswordSyntaxValidAsync(viewModel.Password))
				UpdateErrorCode(ref errorModel,
					"P",
					"Password ",
					$"Password:{viewModel.Password} ");
			#endregion

			#region throw format error
			if (!errorModel.ErrorCode.Equals("FE-"))
			{
				// do trim to end
				errorModel.ErrorDescription = errorModel.ErrorDescription.TrimEnd();
				errorModel.Message = errorModel.Message.TrimEnd();

				throw new ErrorWithCodeException(errorModel);
			}
			#endregion
		}

		private async Task ConflictControlAsync(
			Expression<Func<User, bool>> forWhichKeys
			, UserView viewModel)
		{
			#region get users
			var users = await _manager.UserRepository
				.GetUsersByConditionAsync(forWhichKeys, false);
			#endregion

			#region control conflict error
			if (users.Count != 0)
			{
				var errorModel = new ErrorWithCode()
				{
					StatusCode = 409,
					ErrorCode = "CE-",
					ErrorDescription = "Conflict Error - ",
					Message = "Conflict Error - "
				};

				#region when telNo already exists
				if (users.Any(u => u.TelNo.Equals(viewModel.TelNo)))
					UpdateErrorCode(ref errorModel,
						"T",
						"TelNo ",
						$"TelNo:{viewModel.TelNo} ");
				#endregion

				#region when email already exists
				if (users.Any(u => u.Email.Equals(viewModel.Email)))
					UpdateErrorCode(ref errorModel,
						"E",
						"Email ",
						$"Email:{viewModel.Email} ");
				#endregion

				#region do TrimEnd()
				errorModel.ErrorDescription = errorModel.ErrorDescription.TrimEnd();
				errorModel.Message = errorModel.Message.TrimEnd();
				#endregion

				throw new ErrorWithCodeException(errorModel);
			}
			#endregion
		}

		private void UpdateErrorCode(ref ErrorWithCode errorModel
			, string newErrorCode
			, string newErrorDescription
			, string newMessage)
		{
			errorModel.ErrorCode += newErrorCode;
			errorModel.ErrorDescription += newErrorDescription;
			errorModel.Message += newMessage;
		}
	}
}
