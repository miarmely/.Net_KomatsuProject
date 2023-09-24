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
        private string _baseErrorCode = "FE-U-";
        private string _baseErrorDescription = "Format Error - User - ";
        private string _errorCode;
        private string _errorDescription;

        public ValidationUserFormatFilter(IOptions<UserSettingsConfig> userSettings)
        {
            _userSettings = userSettings.Value;
            _errorCode = _baseErrorCode;
            _errorDescription = _baseErrorDescription;
        }

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

        private async Task FormatControl(object dtoModel,
            IEnumerable<PropertyInfo> properties)
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
                        ControlFirstName(propertyValue as string);
                        break;
                    case "LastName":
                        ControlLastName(propertyValue as string);
                        break;
                    case "CompanyName":
                        ControlCompanyName(propertyValue as string);
                        break;
                    case "TelNo":
                        await ControlTelNoAsync(propertyValue as string);
                        break;
                    case "Email":
                        await ControlEmailAsync(propertyValue as string);
                        break;
                    case "Password":
                        await ControlPasswordAsync(propertyValue as string);
                        break;
                };
                #endregion
            }
            #endregion

            #region when format error occured (throw)
            if (!_errorCode.Equals(_baseErrorCode))
            {
                _errorDescription = _errorDescription.TrimEnd();

                throw new ErrorWithCodeException(404, _errorCode, _errorDescription);
            }
            #endregion
        }

        private void ControlFirstName(string? firstName)
        {
            if (firstName.Length > _userSettings.FirstName.MaxLength)
                UpdateErrorModel("F", "Firstname ");
        }

        private void ControlLastName(string? lastName)
        {
            if (lastName.Length > _userSettings.LastName.MaxLength)
                UpdateErrorModel("L", "LastName ");
        }

        private void ControlCompanyName(string? companyName)
        {
            if (companyName.Length > _userSettings.CompanyName.MaxLength)
                UpdateErrorModel("C", "CompanyName ");
        }

        private async Task ControlTelNoAsync(string? telNo)
        {
            #region length control
            if (telNo.Length != _userSettings.TelNo.Length)
                UpdateErrorModel("T", "TelNo ");
            #endregion

            #region when telNo not convert to int
            else if (!await CanConvertToIntAsync(telNo))
                UpdateErrorModel("T", "TelNo ");
            #endregion
        }

        private async Task ControlEmailAsync(string? email)
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

                var dotIndex = emailExtension.IndexOf('.');

                if (dotIndex == -1  // when '.' not found
                    || dotIndex == 0  // when no char between '@' and '.'
                    || dotIndex == emailExtension.Length - 1)  // when '.' last Index
                    return false;

                #endregion

                #endregion

                return true;
            });

            #region when email not valid
            if (!isEmailValid)
                UpdateErrorModel("E", "Email ");
            #endregion
        }

        private async Task ControlPasswordAsync(string? password)
        {
            if (password.Length < _userSettings.Password.MinLength
                || password.Length > _userSettings.Password.MaxLength)
                UpdateErrorModel("P", "Password ");
        }

        private async Task<bool> CanConvertToIntAsync(string input) =>
            await Task.Run(() =>
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
            });

        private void UpdateErrorModel(string newErrorCode, string newErrorDescription)
        {
            _errorCode += newErrorCode;
            _errorDescription += newErrorDescription;
        }
    }
}