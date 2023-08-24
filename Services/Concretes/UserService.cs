using AutoMapper;
using Entities.ConfigModels;
using Entities.Exceptions;
using Entities.ViewModels;
using Microsoft.Extensions.Options;
using Repositories.Contracts;
using Services.Contracts;

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
			#region format control
			await FormatControlAsync(
				telNo: viewModel.TelNo, 
				password: viewModel.Password);
			#endregion

			#region get employee
			var user = await _manager.UserRepository
				.GetEmployeeByTelNoAsync(viewModel.TelNo, false);
			#endregion

			#region when telNo not found
			if (user == null)
				throw new ErrorWithCodeException(404, 
					"VE-T",
					"Verification Error - Telephone",
					$"Telephone not found. -> telephone:{viewModel.TelNo}");
			#endregion

			#region when password is wrong
			if (!user.Password.Equals(viewModel.Password))
				throw new ErrorWithCodeException(404,
					"VE-P",
					"Verification Error - Password",
					$"Password not found. -> email:{viewModel.Email} && password:{viewModel.Password}");
			#endregion

			var userView = _mapper.Map<UserView>(user);
			//userView.CompanyName = "x";

			return userView;
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

		private async Task FormatControlAsync(UserView viewModel)
		{
			var shortErrorCode = "FE-";
			var longErrorCode = "Format Error - ";

			#region firstName control
			if (viewModel.FirstName != null
				&& viewModel.FirstName.Length != _userConfig.FirstNameMaxLength)
			{
				shortErrorCode = "F";
				longErrorCode = "FirstName ";
			}
			#endregion

			#region lastName control
			if (viewModel.LastName != null
				&& viewModel.LastName.Length != _userConfig.LastNameMaxLength)
			{
				shortErrorCode = "L";
				longErrorCode = "LastName ";
			}
			#endregion

			#region companyName control
			if (viewModel.CompanyName != null
				&& viewModel.CompanyName.Length != _userConfig.CompanyNameMaxLength)
			{
				shortErrorCode = "C";
				longErrorCode = "CompanyName ";
			}
			#endregion

			#region telNo control
			if (viewModel.TelNo != null
				&& !await IsTelNoSyntaxValidAsync(viewModel.TelNo))
			{
				shortErrorCode += "T";
				longErrorCode += "Telephone ";
			}
			#endregion

			#region email control
			if (viewModel.Email != null
				&& !await IsEmailSyntaxValidAsync(viewModel.Email))
			{
				shortErrorCode += "E";
				longErrorCode += "Email ";
			}
			#endregion

			#region password control
			if (viewModel.Password != null
				&& !await IsPasswordSyntaxValidAsync(viewModel.Password))
			{
				shortErrorCode += "P";
				longErrorCode += "Password";
			}
			#endregion

			#region when format error occured
			if (!shortErrorCode.Equals("FE-"))
			{
				longErrorCode = longErrorCode.TrimEnd();

				throw new ErrorWithCodeException(404, shortErrorCode, 
					longErrorCode, longErrorCode);
			}
				
			#endregion
		}
	}
}
