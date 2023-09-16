using Entities.ErrorModels;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.Json;

namespace Presantation.ActionFilters.Attributes
{
	public class ErrorFilter : ExceptionFilterAttribute
	{
		public override async Task OnExceptionAsync(ExceptionContext context)
		{
			#region add log details to error details
			await Task.Run(() =>
			{
				#region set errorDetails
				ErrorDetails errorDetails;

				try
				{
					#region for expected errors
					errorDetails = JsonSerializer
						.Deserialize<ErrorDetails>(context.Exception.Message);
					#endregion
				}
				catch
				{
					#region for unexpected errors
					errorDetails = new ErrorDetails
					{
						StatusCode = 500,
						ErrorCode = "Internal Server Error",
						ErrorDescription = context.Exception.Message
					};
					#endregion
				}
				#endregion

				#region add logDetails to errorDetails
				errorDetails.LogDetails = new LogDetails()
				{
					Controller = context.RouteData.Values["controller"] as string,
					Action = context.RouteData.Values["action"] as string,
					ErrorCode = errorDetails.ErrorCode
				};
				#endregion

				#region save error details on httpContext
				context.HttpContext.Items
					.Add("errorDetails", errorDetails);
				#endregion
			});
			#endregion
		}
	}
}
