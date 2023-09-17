using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Filters;


namespace Presantation.ActionFilters
{
	public class ValidationNullArgumentsAttribute : ServiceFilterAttribute
	{
        public ValidationNullArgumentsAttribute() 
            : base(typeof(ValidationNullArgumentsFilter))
        {}
    }
}
