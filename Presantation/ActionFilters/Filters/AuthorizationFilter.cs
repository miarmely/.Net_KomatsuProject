using Entities.DtoModels;
using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Server.IIS.Core;
using System.Data;
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
                var language = context.HttpContext.Request.Query
                    .FirstOrDefault(q => q.Key.Equals("language"))
                    .Value
                    .ToString();
                #endregion

                #region get expires claim
                var expiresClaim = context.HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type.Equals("exp"));
				#endregion

				#region when user not log in (throw)
				if (expiresClaim == null)
				{
					var errorDto = new ErrorDto
					{
						StatusCode = 401,
						ErrorCode = "AE-U",
						ErrorDescription = "Authorization Error - Unauthorized",
						ErrorMessage = ConvertErrorCodeToErrorMessageByLanguage(
							language,
							"AE-U")
					};

					throw new ErrorWithCodeException(errorDto);
				}
                #endregion

                #region when expires time finished (throw) 
                var expiresInLong = long.Parse(expiresClaim.Value);
				var expiresInDateTime = DateTimeOffset
                    .FromUnixTimeSeconds(expiresInLong)
                    .DateTime;
			    
                if (expiresInDateTime <  DateTime.Now)
                    throw new ErrorWithCodeException(
                        404,
                        "AE-E",
                        "Authentication Error - Expires",
                        ConvertErrorCodeToErrorMessageByLanguage(language, "AE-E"));
                #endregion

                #region get role claims on token

                #region get roleClaims
                var roleClaims = context.HttpContext.User
                    .Claims
                    .Where(c => c.Type.Equals(ClaimTypes.Role));
                #endregion

                #region get roleName in roleClaims
                var roleNamesOnToken = new List<string>();

                foreach (var roleClaim in roleClaims)
                    roleNamesOnToken.Add(roleClaim.Value);
				#endregion

				#endregion

				#region control role names in role claims

				#region compare role names 
				foreach (var roleNameOnToken in roleNamesOnToken)
                {
                    #region when authority is has
                    if (_roleNamesOnAttribute.Contains(roleNameOnToken))
                        return;
                    #endregion
                }
                #endregion

                #region when authority not enough (throw)
                throw new ErrorWithCodeException(403,
					"AE-F",
					"Authorization Error - Forbidden",
					ConvertErrorCodeToErrorMessageByLanguage(language, "AE-F"));
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
                    "AE-F" => "yetkiniz yok",
                    "AE-E" => "oturum süreniz doldu"
                },
                "EN" => errorCode switch
                {
                    "AE-U" => "you are not logged in",
                    "AE-F" => "you don't have permission",
                    "AE-E" => "your session time expired"
				}
            };
        }

        #endregion
    }
}
