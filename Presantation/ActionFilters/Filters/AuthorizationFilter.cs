using Entities.DtoModels;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Data;
using System.Runtime.CompilerServices;
using System.Security.Claims;


namespace Presantation.ActionFilters.Filters
{
    public class AuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly List<string> _roleNamesOnAttribute;

        public AuthorizationFilter(List<string> roleNamesOnAttribute) =>
            _roleNamesOnAttribute = roleNamesOnAttribute;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context) =>
            await Task.Run(() =>
            {
                #region get language
                var language = context.RouteData.Values
                    .FirstOrDefault(v => v.Value.Equals("Language"))
                    .Value
                    as string;
                #endregion

                #region get claims on token

                #region get roleClaims (throw)
                var roleClaims = context.HttpContext.User
                    .Claims
                    .Where(c => c.Type.Equals(ClaimTypes.Role));

                #region when any roleNames not exists in token (throw)
                if (roleClaims.Count() == 0)
                {
                    context.HttpContext.Items.Add("errorDetails", new ErrorDto
                    {
                        StatusCode = 401,
                        ErrorCode = "AE-U",
                        ErrorDescription = "Authorization Error - Unauthorized",
                        ErrorMessage = ConvertErrorCodeToErrorMessageByLanguage(
                            language,
                            "AE-U")
                    });

                    throw new Exception();
                }
                #endregion

                #endregion

                #region get roleName in roleClaims
                var roleNamesOnToken = new List<string>();

                foreach (var roleClaim in roleClaims)
                    roleNamesOnToken.Add(roleClaim.Value);
                #endregion

                #endregion

                #region get roleNames on token and control they
                foreach (var roleNameOnToken in roleNamesOnToken)
                {
                    #region when authority is has
                    if (_roleNamesOnAttribute.Contains(roleNameOnToken))
                        return;
                    #endregion
                }
                #endregion

                #region when authority not enough (throw)

                #region save error details to HttpContext
                context.HttpContext.Items.Add("errorDetails", new ErrorDto
                {
                    StatusCode = 403,
                    ErrorCode = "AE-F",
                    ErrorDescription = "Authorization Error - Forbidden",
                    ErrorMessage = ConvertErrorCodeToErrorMessageByLanguage(
                        language,
                        "AE-F")
                });

                throw new Exception();
                #endregion

                #endregion
            });


        #region private

        private string ConvertErrorCodeToErrorMessageByLanguage(
            string language,
            string errorCode)
        {
            return language switch
            {
                "TR" => errorCode switch
                {
                    "AE-U" => "oturum açmadınız",
                    "AE-F" => "yetkiniz yok"
                },
                "EN" => errorCode switch
                {
                    "AE-U" => "you are not logged in",
                    "AE-F" => "you don't have permission"
                }
            };
        }

        #endregion
    }
}
