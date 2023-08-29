using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters.Attributes;

namespace Presantation.ActionFilters
{
    public class SaveLogAttribute : ServiceFilterAttribute
    {
        public SaveLogAttribute() : base(typeof(LogFilter))
        { }
    }
}
