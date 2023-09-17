using Entities.ConfigModels;
using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;

namespace Presantation.ActionFilters.Attributes
{
    public class ValidationUserFormatFilter : IAsyncActionFilter
    {
        private readonly UserSettingsConfig _userSettings;
        private string _errorCode = "FE-U-";
        private string _errorDescription = "Format Error - User - ";

		public ValidationUserFormatFilter(IOptions<UserSettingsConfig> userSettings) =>
			_userSettings = userSettings.Value;
        
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            #region get dto model
            var dtoModel = context.ActionArguments
                .SingleOrDefault(a => a.Key.Contains("Dto"))
                .Value;
            #endregion

            #region get properties of dto model
            var properties = dtoModel
                .GetType()
                .GetProperties()
                .AsEnumerable();
            #endregion

            await FormatControl(dtoModel, properties);
            await next();
        }

        private async Task FormatControl(object dtoModel, IEnumerable<PropertyInfo> properties)
        {
            object propertyValue;

            #region control format of dtoModel properties
            foreach (var property in properties)
            {
				#region don't check property if null
				propertyValue = property.GetValue(dtoModel);

                if (propertyValue == null)
                    continue;
                #endregion

                #region control formats
                switch (property.Name)
                {
                    case "FirstName":
                        await ControlFirstName(propertyValue as string);
                        break;
                    case "LastName":
                        await ControlLastName(propertyValue as string);
                        break;
                    case "CompanyName":
                        await ControlCompanyName(propertyValue as string);
                        break;
                    case "TelNo":
                        await ControlTelNo(propertyValue as string);
                        break;
                    case "Email":
                        await ControlEmail(propertyValue as string);
                        break;
                    case "Password":
                        await ControlPassword(propertyValue as string);
                        break;
                };
                #endregion
            }
            #endregion

            #region when format error occured (throw)
            if (!_errorCode.Equals("FE-"))
            {
                _errorDescription = _errorDescription.TrimEnd();

                throw new ErrorWithCodeException(404, _errorCode, _errorDescription);
            }
            #endregion
        }

        private async Task ControlFirstName(string? firstName) =>
            await Task.Run(() =>
            {
                if (firstName.Length > _userSettings.FirstName.MaxLength)
                    UpdateErrorModel("F", "Firstname ");
            });

        private async Task ControlLastName(string? lastName) =>
            await Task.Run(() =>
            {
                if (lastName.Length > _userSettings.LastName.MaxLength)
                    UpdateErrorModel("L", "LastName ");
            });

        private async Task ControlCompanyName(string? companyName) =>
            await Task.Run(() =>
            {
                if (companyName.Length > _userSettings.CompanyName.MaxLength)
                    UpdateErrorModel("C", "CompanyName ");
            });

        private async Task ControlTelNo(string? telNo)
        {
			var isTelNoValid = await Task.Run(() =>
			{
				#region length control
				if (telNo.Length != _userSettings.TelNo.Length)
					return false;
				#endregion

				#region when telNo not convert to int
				else if (!CanConvertToInt(telNo))
                    return false;
                #endregion

                return true;
			});

			#region when telNo not valid
			if (!isTelNoValid)
				UpdateErrorModel("T", "TelNo ");
            #endregion
        }
            
        private async Task ControlEmail(string? email)
        {
            var isEmailValid = await Task.Run(() =>
            {
                #region control '@'
                var atIndex = email.IndexOf('@');
                if (atIndex == email.Length - 1 // when '@' in last index.
                    || atIndex == -1)  // when '@' not found
                    return false;
                #endregion

                #region email max length control
                else if (email.Length > _userSettings.Email.MaxLength)
                    return false;
                #endregion

                #region control email extension

                #region length control
                var emailExtension = email.Substring(atIndex + 1); // ex: gmail.com

                if (emailExtension.IsNullOrEmpty() // ex: @
                    || emailExtension.Length < 3)  // ex: @x. || @.x  ...
                    return false;
                #endregion

                #region control '.'

                #region dot quantity more than 1
                var dotQuantity = emailExtension.Where(c => c.Equals('.'))
                    .Count();

                if (dotQuantity != 1)
                    return false;
                #endregion

                #region general control
                var dotIndex = emailExtension.IndexOf('.');

                if (dotIndex == -1  // when '.' not found
                    || dotIndex == 0  // when no char between '@' and '.'
                    || dotIndex == emailExtension.Length - 1)  // when '.' last Index
                    return false;
                #endregion

                #endregion

                #endregion

                return true;
            });

            if (!isEmailValid)
                UpdateErrorModel("E", "Email ");
		}

        private async Task ControlPassword(string? password) =>
            await Task.Run(() =>
            {
                if (password.Length < _userSettings.Password.MinLength
                    || password.Length > _userSettings.Password.MaxLength)
                    UpdateErrorModel("P", "Password ");
            });

        private void UpdateErrorModel(string newErrorCode, string newErrorDescription)
        {
            _errorCode += newErrorCode;
            _errorDescription += newErrorDescription;
        }

        private bool CanConvertToInt(string input)
        {
			#region control left chunk of string
			var leftChunkOfString = input.Substring(0, input.Length / 2);

            if (!int.TryParse(leftChunkOfString, out int _))
                return false;
			#endregion

			#region control right chunk of string
			var rightChunkOfString = input.Substring(input.Length / 2);

			if (!int.TryParse(rightChunkOfString, out int _))
				return false;
			#endregion

            return true;
		}
    }
}