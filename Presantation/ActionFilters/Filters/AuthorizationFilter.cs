using Entities.DtoModels;
using Microsoft.AspNetCore.Mvc.Filters;
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
                #region get claims on token

                #region get roleClaims (throw)
                var roleClaims = context.HttpContext.User
                    .Claims
                    .Where(c => c.Type.Equals(ClaimTypes.Role));

                #region when roleNames not exists in token (throw)
                if (roleClaims.Count() == 0)
                {
                    SaveErrorDetailsToHttpContext(context, new ErrorDto
                    {
                        StatusCode = 401,
                        ErrorCode = "AE-U",
                        ErrorDescription = "Authorization Error - Unauthorized",
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

                #region get language
                var language = context.HttpContext.User.Claims
                    .Where(c => c.Type.Equals("Language"))
                    .Single();
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
                SaveErrorDetailsToHttpContext(context, new ErrorDto
                {
                    StatusCode = 403,
                    ErrorCode = "AE-F",
                    ErrorDescription = "Authorization Error - Forbidden",
                });

                throw new Exception();
                #endregion
            });

        private void SaveErrorDetailsToHttpContext(
            AuthorizationFilterContext context,
            ErrorDto errorDto)
        {
            #region set errorDtoG
            var errorDtoG = new ErrorDtoForGlobalExceptionHandling
            {
                StatusCode = errorDto.StatusCode,
                ErrorCode = errorDto.ErrorCode,
                ErrorDescription = errorDto.ErrorDescription,
            };
            #endregion

            #region set controller and action of errorDtos
            errorDtoG.Controller = context.RouteData
                .Values["controller"]
                .ToString();

            errorDtoG.Action = context.RouteData
                .Values["controller"]
                .ToString();
            #endregion

            context.HttpContext.Items.Add("errorDetails", errorDtoG);
        }
    }
}
