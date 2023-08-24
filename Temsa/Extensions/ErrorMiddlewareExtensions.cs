using Entities.ErrorModels;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json;

namespace Temsa.Extensions
{
	public static class ErrorMiddlewareExtensions
	{
		public static void ConfigureExceptionHandler(this IServiceCollection services, WebApplication app)
		{
			app.UseExceptionHandler(configure =>
				configure.Run(async context =>
				{
					#region set response as default 
					context.Response.StatusCode = StatusCodes.Status500InternalServerError;
					#endregion

					#region when any error occured
					var contextFeature = context.Features.Get<IExceptionHandlerFeature>();

					if (contextFeature != null)
					{
						// deserialize error model
						var errorModel = JsonSerializer
							.Deserialize<ErrorWithCode>(contextFeature.Error.Message);
					
						// set response settings
						context.Response.ContentType = "application/json";
						context.Response.StatusCode = errorModel.StatusCode;

						await context.Response.WriteAsJsonAsync(errorModel);
					}
					#endregion
				})
			);
		}
	}
}
