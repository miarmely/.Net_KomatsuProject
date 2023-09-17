using Entities.DtoModels;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.Json;

namespace Presantation.ActionFilters.Attributes
{
    public class ErrorFilter : ExceptionFilterAttribute
	{
		public override async Task OnExceptionAsync(ExceptionContext context)
		{
			#region save error message to httpContext
			await Task.Run(() =>
			{
				#region set errorDto
				ErrorDtoForExceptionFilter errorDto;

				#region get controller and action names
				var controllerName = context.RouteData
					.Values["controller"]
					.ToString();

				var actionName = context.RouteData
					.Values["controller"]
					.ToString();
				#endregion

				try
				{
					#region for expected errors
					errorDto = JsonSerializer
						.Deserialize<ErrorDtoForExceptionFilter>(
							context.Exception.Message);

					errorDto.Controller = controllerName;
					errorDto.Action = actionName;
					#endregion
				}
				catch
				{
					#region for unexpected errors
					errorDto = new ErrorDtoForExceptionFilter
					{
						StatusCode = 500,
						ErrorCode = "Internal Server Error",
						ErrorDescription = context.Exception.Message,
						Controller = controllerName,
						Action = actionName
					};
					#endregion
				}
				#endregion

				#region save errorDto to httpContext
				context.HttpContext.Items.Add("errorDetails", errorDto);
				#endregion
			});
			#endregion
		}
	}
}
