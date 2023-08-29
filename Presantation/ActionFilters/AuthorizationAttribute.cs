using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Attributes;

namespace Presantation.ActionFilters
{
	public class AuthorizationAttribute : TypeFilterAttribute
	{
		public AuthorizationAttribute(string[] permission)
			: base(typeof(AuthorizationFilter))
		{
			base.Arguments = new object[] { permission };
		}
	}
}
