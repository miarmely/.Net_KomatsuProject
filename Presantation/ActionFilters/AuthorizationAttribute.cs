using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Filters;

namespace Presantation.ActionFilters
{
    public class AuthorizationAttribute : TypeFilterAttribute
    {
        public AuthorizationAttribute(string roleNames)
            : base(typeof(AuthorizationFilter))
        {
            // string to list
            var roleNamesInList = roleNames.Split(',').ToList();

            // set constructor parameters of "AuthorizationFilter"
            base.Arguments = new object[] { roleNamesInList };
        }
    }
}
