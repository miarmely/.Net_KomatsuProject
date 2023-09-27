using AutoMapper.Configuration.Annotations;
using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Data;
using System.Security.Claims;

namespace Presantation.ActionFilters.Filters
{
    public class AuthorizationFilter : IAsyncAuthorizationFilter
    {
        private readonly List<string> _roleNamesOnAttribute;

        public AuthorizationFilter(List<string> roleNames) =>
           _roleNamesOnAttribute = roleNames;
        
            
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            #region get roleNames in token

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

            #region control authorization
            foreach (var roleNameOnToken in roleNamesOnToken)
            {
                #region when authority is has
                if (_roleNamesOnAttribute.Contains(roleNameOnToken))
                    return;
                #endregion
            }
            #endregion

            throw new ErrorWithCodeException(403,
                "AE-U",
                "Authorization Error - Unauthorized");
        }
    }
}
