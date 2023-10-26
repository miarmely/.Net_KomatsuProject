using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes.Filters;

namespace Presantation.Attributes
{
	public class ValidationUserFormatAttribute : ServiceFilterAttribute
	{
        public ValidationUserFormatAttribute() 
            : base(typeof(ValidationUserFormatFilter))
        {}
    }
}
