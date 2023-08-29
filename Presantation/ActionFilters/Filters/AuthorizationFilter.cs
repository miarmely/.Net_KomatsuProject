using Microsoft.AspNetCore.Mvc.Filters;

namespace Presantation.ActionFilters.Attributes
{
	public class AuthorizationFilter : IAuthorizationFilter
	{
		private readonly string[] _permission;

		public AuthorizationFilter(string[] permission) =>
			_permission = permission;

		public void OnAuthorization(AuthorizationFilterContext context)
		{

		}
	}
}
