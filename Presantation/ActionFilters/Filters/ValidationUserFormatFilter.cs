using Entities.ConfigModels;
using Entities.ErrorModels;
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
        private readonly ErrorDetails _errorModel;

        public ValidationUserFormatFilter(IOptions<UserSettingsConfig> userSettings)
        {
            _errorModel = new ErrorDetails()
            {
                StatusCode = 400,
                ErrorCode = "FE-",
                ErrorDescription = "Format Error - ",
            };
            _userSettings = userSettings.Value;
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

        private async Task FormatControl(object dtoModel, IEnumerable<PropertyInfo> properties)
        {
            object value;

            #region control format of dtoModel properties
            foreach (var property in properties)
            {
                #region don't check value if is null.
                value = property.GetValue(dtoModel);

                if (value == null)
                    continue;
                #endregion

                #region control formats
                switch (property.Name)
                {
                    case "FirstName":
                        await ControlFirstName(value as string);
                        break;
                    case "LastName":
                        await ControlLastName(value as string);
                        break;
                    case "CompanyName":
                        await ControlCompanyName(value as string);
                        break;
                    case "TelNo":
                        await ControlTelNo(value as string);
                        break;
                    case "Email":
                        await ControlEmail(value as string);
                        break;
                    case "Password":
                        await ControlPassword(value as string);
                        break;
                };
                #endregion
            }
            #endregion

            #region when format error occured (throw)
            if (!_errorModel.ErrorCode.Equals("FE-"))
            {
                _errorModel.ErrorDescription = _errorModel.ErrorDescription
                    .TrimEnd();

                throw new ErrorWithCodeException(_errorModel);
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

        private async Task ControlTelNo(string? telNo) =>
            await Task.Run(() =>
            {
                // length control
                if (telNo.Length != _userSettings.TelNo.Length)
                    UpdateErrorModel("T", "TelNo ");
            });

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

        private void UpdateErrorModel(object newErrorCode
            , string newErrorDescription)
        {
            _errorModel.ErrorCode += newErrorCode;
            _errorModel.ErrorDescription += newErrorDescription;
        }
    }
}