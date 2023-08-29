using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Attributes;

namespace Presantation.ActionFilters
{
    public class ModifyErrorAttribute : ServiceFilterAttribute
    {
        public ModifyErrorAttribute() : base(typeof(ErrorFilter))
        { }
    }
}
