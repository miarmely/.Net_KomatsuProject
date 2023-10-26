using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes.Filters;

namespace Presantation.Attributes
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
