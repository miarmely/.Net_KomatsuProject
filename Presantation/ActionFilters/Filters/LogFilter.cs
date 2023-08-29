using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Services.Contracts;

namespace Presantation.ActionFilters.Attributes
{
    public class LogFilter : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            #region get logger service
            var _logger = context.HttpContext.RequestServices
                .GetRequiredService<ILoggerService>();
            #endregion

            var controller = context.RouteData.Values["controller"];
            var action = context.RouteData.Values["action"];

            //_logger.LogInfo($"controller:");

        }
    }
}
