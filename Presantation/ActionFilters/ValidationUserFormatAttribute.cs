using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Attributes;

namespace Presantation.ActionFilters
{
	public class ValidationUserFormatAttribute : ServiceFilterAttribute
	{
        public ValidationUserFormatAttribute() 
            : base(typeof(ValidationUserFormatFilter))
        {}
    }
}
