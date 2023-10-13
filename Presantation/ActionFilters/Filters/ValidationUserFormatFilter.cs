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
            #region get dto model on parameter
            var dtoModel = context.ActionArguments
                .FirstOrDefault(a => a.Key.Contains("Dto"))
                .Value;
            #endregion

            #region get language on parameter
            var language = context.ActionArguments
                .FirstOrDefault(a => a.Equals("language"))
                .Value
                as string;
            #endregion

            #region get properties of dto model
            var properties = dtoModel
                .GetType()
                .GetProperties();
            #endregion

            await FormatControl(language, dtoModel, properties);
            await next();
        }


        #region private

        private async Task FormatControl(
            string language,
            object dtoModel,
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
                        ControlPassword(propertyValue as string);
                        break;
                };
                #endregion
            }
            #endregion

            #region when format error occured (throw)
            if (!_errorCode.Equals(_baseErrorCode))
            {
                // do trim error description
                _errorDescription = _errorDescription.TrimEnd();

                // throw error
                throw new ErrorWithCodeException(404, 
                    _errorCode, 
                    _errorDescription,
                    ConvertErrorCodeToErrorMessageByLanguage(language, _errorCode));
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
                var emailExtension = email.Substring(atIndex + 1); // ex => gmail.com

                if (emailExtension.IsNullOrEmpty() // ex => @
                    || emailExtension.Length < 3)  // ex => @x. || @.x  ...
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

        private void ControlPassword(string? password)
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

        private string ConvertErrorCodeToErrorMessageByLanguage(string language, string errorCode)
        {
            #region format error codes
            return language switch
            {
                "TR" => errorCode switch
                {
                    #region with one code
                    "FE-U-F" => "ad geçerli değil",
                    "FE-U-L" => "soyad geçerli değil",
                    "FE-U-C" => "şirket adı geçerli değil",
                    "FE-U-T" => "telefon numarası geçerli değil",
                    "FE-U-E" => "email geçerli değil",
                    "FE-U-P" => "şifre geçerli değil",
                    #endregion

                    #region with two code
                    "FE-U-FL" => "ad ve soyad geçerli değil",
                    "FE-U-FC" => "ad ve şirket adı geçerli değil",
                    "FE-U-FT" => "ad ve telefon numarası geçerli değil",
                    "FE-U-FE" => "ad ve email geçerli değil",
                    "FE-U-FP" => "ad ve şifre geçerli değil",
                    "FE-U-LC" => "soyad ve şirket adı geçerli değil",
                    "FE-U-LT" => "soyad ve telefon geçerli değil",
                    "FE-U-LE" => "soyad ve email geçerli değil",
                    "FE-U-LP" => "soyad ve şifre geçerli değil",
                    "FE-U-CT" => "soyad ve şifre geçerli değil",
                    "FE-U-CE" => "şirket adı ve email geçerli değil",
                    "FE-U-CP" => "şirket adı ve şifre geçerli değil",
                    "FE-U-TE" => "telefon numarası ve email geçerli değil",
                    "FE-U-TP" => "telefon numarası ve şifre geçerli değil",
                    "FE-U-EP" => "email ve şifre geçerli değil",
                    #endregion

                    #region with three code
                    "FE-U-FLC" => "ad, soyad ve şirket adı geçerli değil",
                    "FE-U-FLT" => "ad, soyad ve telefon numarası geçerli değil",
                    "FE-U-FLE" => "ad, soyad ve email geçerli değil",
                    "FE-U-FLP" => "ad, soyad ve şifre geçerli değil",
                    "FE-U-FCT" => "ad, şirket adı ve telefon numarası geçerli değil",
                    "FE-U-FCE" => "ad, şirket adı ve email geçerli değil",
                    "FE-U-FCP" => "ad, şirket adı ve şifre geçerli değil",
                    "FE-U-FTE" => "ad, telefon numarası ve email geçerli değil",
                    "FE-U-FTP" => "ad, telefon numarası ve şifre geçerli değil",
                    "FE-U-FEP" => "ad, email ve şifre geçerli değil",
                    "FE-U-LCT" => "soyad, şirket adı ve telefon numarası geçerli değil",
                    "FE-U-LCE" => "soyad, şirket adı ve email geçerli değil",
                    "FE-U-LCP" => "soyad, şirket adı ve şifre geçerli değil",
                    "FE-U-LTE" => "soyad, telefon numarası ve email geçerli değil",
                    "FE-U-LTP" => "soyad, telefon numarası ve şifre geçerli değil",
                    "FE-U-LEP" => "soyad, email ve şifre geçerli değil",
                    "FE-U-CTE" => "şirket adı, telefon numarası ve email geçerli değil",
                    "FE-U-CTP" => "şirket adı, telefon numarası ve şifre geçerli değil",
                    "FE-U-CEP" => "şirket adı, email ve şifre geçerli değil",
                    "FE-U-TEP" => "telefon numarası, email ve şifre geçerli değil",
                    #endregion

                    #region with four code
                    "FE-U-FLCT" => "ad, soyad, şirket adı ve telefon numarası geçerli değil",
                    "FE-U-FLCE" => "ad, soyad, şirket adı ve email geçerli değil",
                    "FE-U-FLCP" => "ad, soyad, şirket adı ve şifre geçerli değil",
                    "FE-U-FLTE" => "ad, soyad, telefon numarası ve email geçerli değil",
                    "FE-U-FLTP" => "ad, soyad, telefon numarası ve şifre geçerli değil",
                    "FE-U-FLEP" => "ad, soyad, email ve şifre geçerli değil",
                    "FE-U-FCTE" => "ad, şirket adı, telefon numarası ve email geçerli değil",
                    "FE-U-FCTP" => "ad, şirket adı, telefon numarası ve şifre geçerli değil",
                    "FE-U-FCEP" => "ad, şirket adı, email ve şifre geçerli değil",
                    "FE-U-FTEP" => "ad, telefon numarası, email ve şifre geçerli değil",
                    "FE-U-LCTE" => "soyad, şirket adı, telefon numarası ve email geçerli değil",
                    "FE-U-LCTP" => "soyad, şirket adı, telefon numarası ve şifre geçerli değil",
                    "FE-U-LCEP" => "soyad, şirket adı, email ve şifre geçerli değil",
                    "FE-U-LTEP" => "soyad, telefon numarası, email ve şifre geçerli değil",
                    "FE-U-CTEP" => "şirket adı, telefon numarası, email ve şifre geçerli değil",
                    #endregion

                    #region with five code
                    "FE-U-FLCTE" => "ad, soyad, şirket adı, telefon numarası ve email geçerli değil",
                    "FE-U-FLCTP" => "ad, soyad, şirket adı, telefon numarası ve şifre geçerli değil",
                    "FE-U-FLCEP" => "ad, soyad, şirket adı, email ve şifre geçerli değil",
                    "FE-U-FLTEP" => "ad, soyad, telefon numarası, email ve şifre geçerli değil",
                    "FE-U-FCTEP" => "ad, şirket adı, telefon numarası, email ve şifre geçerli değil",
                    "FE-U-LCTEP" => "soyad, şirket adı, telefon numarası, email ve şifre geçerli değil",
                    #endregion

                    #region with six code
                    "FE-U-FLCTEP" => "ad, soyad, şirket adı, telefon numarası, email ve şifre geçerli değil"
                    #endregion
                },
                "EN" => errorCode switch
                {
                    #region with one code
                    "FE-U-F" => "firstname not valid",
                    "FE-U-L" => "lastname not valid",
                    "FE-U-C" => "company name not valid",
                    "FE-U-T" => "telephone number not valid",
                    "FE-U-E" => "email not valid",
                    "FE-U-P" => "password not valid",
                    #endregion

                    #region with two code
                    "FE-U-FL" => "firstname and lastname not valid",
                    "FE-U-FC" => "firstname and company name not valid",
                    "FE-U-FT" => "firstname and telephone number not valid",
                    "FE-U-FE" => "firstname and email not valid",
                    "FE-U-FP" => "firstname and password not valid",
                    "FE-U-LC" => "lastname and company name not valid",
                    "FE-U-LT" => "lastname and telephone number not valid",
                    "FE-U-LE" => "lastname and email not valid",
                    "FE-U-LP" => "lastname and password not valid",
                    "FE-U-CT" => "company name and telephone not valid",
                    "FE-U-CE" => "company name and email not valid",
                    "FE-U-CP" => "company name and password not valid",
                    "FE-U-TE" => "telephone number and email not valid",
                    "FE-U-TP" => "telephone number and password not valid",
                    "FE-U-EP" => "email and password not valid",
                    #endregion

                    #region with three code
                    "FE-U-FLC" => "firstname, lastname and company name not valid",
                    "FE-U-FLT" => "firstname, lastname and telephone number not valid",
                    "FE-U-FLE" => "firstname, lastname and email not valid",
                    "FE-U-FLP" => "firstname, lastname and password not valid",
                    "FE-U-FCT" => "firstname, company name and telephone number not valid",
                    "FE-U-FCE" => "firstname, company name and email not valid",
                    "FE-U-FCP" => "firstname, company name and password not valid",
                    "FE-U-FTE" => "firstname, telephone number and email not valid",
                    "FE-U-FTP" => "firstname, telephone number and password not valid",
                    "FE-U-FEP" => "firstname, email and password not valid",
                    "FE-U-LCT" => "lastname, company name and telephone number not valid",
                    "FE-U-LCE" => "lastname, company name and email not valid",
                    "FE-U-LCP" => "lastname, company name and password not valid",
                    "FE-U-LTE" => "lastname, telephone number and email not valid",
                    "FE-U-LTP" => "lastname, telephone number and password not valid",
                    "FE-U-LEP" => "lastname, email and password not valid",
                    "FE-U-CTE" => "company name, telephone number and email not valid",
                    "FE-U-CTP" => "company name, telephone number and password not valid",
                    "FE-U-CEP" => "company name, email and password not valid",
                    "FE-U-TEP" => "telephone number, email and password not valid",
                    #endregion

                    #region with four code
                    "FE-U-FLCT" => "firstname, lastname, company name and telephone number not valid",
                    "FE-U-FLCE" => "firstname, lastname, company name and email not valid",
                    "FE-U-FLCP" => "firstname, lastname, company name and password not valid",
                    "FE-U-FLTE" => "firstname, lastname, telephone number and email not valid",
                    "FE-U-FLTP" => "firstname, lastname, telephone number and password not valid",
                    "FE-U-FLEP" => "firstname, lastname, email and password not valid",
                    "FE-U-FCTE" => "firstname, company name, telephone number and email not valid",
                    "FE-U-FCTP" => "firstname, company name, telephone number and password not valid",
                    "FE-U-FCEP" => "firstname, company name, email and password not valid",
                    "FE-U-FTEP" => "firstname, telephone number, email and password not valid",
                    "FE-U-LCTE" => "lastname, company name, telephone number and email not valid",
                    "FE-U-LCTP" => "lastname, company name, telephone number and password not valid",
                    "FE-U-LCEP" => "lastname, company name, email and password not valid",
                    "FE-U-LTEP" => "lastname, telephone number, email and password not valid",
                    "FE-U-CTEP" => "company name, telephone number, email and password not valid",
                    #endregion

                    #region with five code
                    "FE-U-FLCTE" => "firstname, lastname, company name, telephone number and email not valid",
                    "FE-U-FLCTP" => "firstname, lastname, company name, telephone number and password not valid",
                    "FE-U-FLCEP" => "firstname, lastname, company name, email and password not valid",
                    "FE-U-FLTEP" => "firstname, lastname, telephone number, email and password not valid",
                    "FE-U-FCTEP" => "firstname, company name, telephone number, email and password not valid",
                    "FE-U-LCTEP" => "lastname, company name, telephone number, email and password not valid",
                    #endregion

                    #region with six code
                    "FE-U-FLCTEP" => "firstname, lastname, company name, telephone number, email and password not valid"
                    #endregion
                }
            };
            #endregion
        }
        #endregion
    }
}