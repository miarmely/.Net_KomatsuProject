using Entities.ErrorModels;
using Microsoft.AspNetCore.Diagnostics;
using Services.Contracts;
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
					#region get context feature
					var contextFeature = context.Features
						.Get<IExceptionHandlerFeature>();
					#endregion

					#region when any error occured
					if (contextFeature != null)
					{
						#region set "response" as default
						context.Response.StatusCode = StatusCodes.Status500InternalServerError;
						#endregion

						#region deserialize error model
						var errorModel = JsonSerializer
							.Deserialize<ErrorDetails>(contextFeature.Error.Message);
						#endregion

						#region set response settings
						context.Response.ContentType = "application/json";
						context.Response.StatusCode = errorModel.StatusCode;
						#endregion

						#region get logger service
						var loggerService = context.RequestServices
							.GetRequiredService<ILoggerService>();
						#endregion

						#region save log
						var serializedErrorMsg= JsonSerializer
							.Serialize(errorModel.Message);

						// for expected errors
						if (context.Response.StatusCode != 500)
							loggerService.LogWarning(contextFeature.Error.Message);

						// for unexpected errors
						else
							loggerService.LogError(contextFeature.Error.Message);
						#endregion

						await context.Response.WriteAsJsonAsync(errorModel);
					}
					#endregion
				})
			);
		}
	}
}
