using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes.Filters;

namespace Presantation.Attributes
{
	public class AuthorizationAttribute : TypeFilterAttribute
	{
		public AuthorizationAttribute(string? roleNames = null)
			: base(typeof(AuthorizationFilter))
		{
			// string to list
			var roleNamesInList = roleNames == null ?
				new List<string>()  // when all roles is valid (empty list)
				: roleNames.Split(',').ToList();  // for specific roles is valid

			// set constructor parameters of "AuthorizationFilter"
			base.Arguments = new object[] { roleNamesInList };
		}
	}
}
