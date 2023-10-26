using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes.Filters;


namespace Presantation.Attributes
{
	public class ValidationNullArgumentsAttribute : ServiceFilterAttribute
	{
        public ValidationNullArgumentsAttribute() 
            : base(typeof(ValidationNullArgumentsFilter))
        {}
    }
}
