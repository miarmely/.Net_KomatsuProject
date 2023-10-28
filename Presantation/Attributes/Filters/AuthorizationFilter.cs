using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Data;
using System.Security.Claims;


namespace Presantation.Attributes.Filters
{
    public class AuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly List<string> _roleNamesOnAttribute;

        public AuthorizationFilter(List<string> roleNamesOnAttribute) =>
            _roleNamesOnAttribute = roleNamesOnAttribute;

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context) =>
            await Task.Run(() =>
            {
				#region get projectName
				var actionDetails = context.ActionDescriptor.DisplayName
					.Split('.');

				var projectName = actionDetails[0];
				#endregion

				#region when user not sign in (throw)
				if (!context.HttpContext.User.Identity.IsAuthenticated)
				{
					#region for web
					if (projectName.Equals("Temsa_Web"))
					{
						#region redirect to login page
						context.Result = new RedirectToActionResult(
							"Login",
							"Authentication",
							null);
						#endregion

						return;
					}
					#endregion

					#region for mobile (throw)
					else  // Presentation
						throw new ErrorWithCodeException(
							401,
							"AE-U",
							"Authorization Error - Unauthorized",
							ConvertErrorCodeToErrorMessageByLanguage("TR", "AE-U"));
					#endregion
				}
				#endregion

				#region get language
				string? language = "TR";

				#region for web
				if (projectName == "Temsa_Web")
				{
					#region get language on http context
					var languageInContext = context.HttpContext
						.Items
						.FirstOrDefault(i => i.Key.Equals("language"))
						.Value
						as string;
					
					// change default language
					if (languageInContext != null)
						language = languageInContext;
					#endregion
				}
				#endregion

				#region for mobile
				else
				{
					language = context.HttpContext.Request.Query
						.FirstOrDefault(q => q.Key.Equals("language"))
						.Value;
				}
				#endregion

				#endregion

				#region control expires (throw)

				#region get expires claim
				var expiresClaim = context.HttpContext.User.Claims
					.FirstOrDefault(c => c.Type.Equals("exp"));
				#endregion

				#region when expires time finished (throw) 
				var expiresInLong = long.Parse(expiresClaim.Value);
				var expiresInDateTime = DateTimeOffset
					.FromUnixTimeSeconds(expiresInLong)
					.DateTime;

				if (expiresInDateTime < DateTime.UtcNow)
					throw new ErrorWithCodeException(
						404,
						"AE-E",
						"Authentication Error - Expires",
						ConvertErrorCodeToErrorMessageByLanguage(language, "AE-E"));
				#endregion

				#endregion

				#region control roles (throw)

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

				#region control role names in role claims (throw)

				#region compare role names 
				foreach (var roleNameOnToken in roleNamesOnToken)
				{
					// when authority is has
					if (_roleNamesOnAttribute.Contains(roleNameOnToken))
						return;
				}
				#endregion

				#region when authority not enough (throw)
				throw new ErrorWithCodeException(403,
					"AE-F",
					"Authorization Error - Forbidden",
					ConvertErrorCodeToErrorMessageByLanguage(language, "AE-F"));
				#endregion

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
