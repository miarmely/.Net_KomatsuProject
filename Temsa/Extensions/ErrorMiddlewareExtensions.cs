using Entities.ErrorModels;
using Microsoft.AspNetCore.Diagnostics;
using Services.Concretes;
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
					#region set default response
					context.Response.StatusCode = StatusCodes.Status500InternalServerError;
					#endregion

					#region when any error occured
					var contextFeature = context.Features.Get<IExceptionHandlerFeature>();

					if (contextFeature != null)
					{
						#region deserialize error model
						var errorModel = JsonSerializer
							.Deserialize<ErrorWithCode>(contextFeature.Error.Message);
						#endregion

						#region get logger service
						var loggerService = context.RequestServices
							.GetRequiredService<ILoggerService>();
						#endregion

						#region set response settings
						context.Response.ContentType = "application/json";
						context.Response.StatusCode = errorModel.StatusCode;
						#endregion

						#region save log
						var serializedErrorMessage= JsonSerializer.
							Serialize(contextFeature.Error.Message);

						// for expected errors
						if (context.Response.StatusCode != 500)
							loggerService.LogInfo(serializedErrorMessage);

						// for unexpected errors
						else
							loggerService.LogError(serializedErrorMessage);
						#endregion

						await context.Response.WriteAsJsonAsync(errorModel);
					}
					#endregion
				})
			);
		}
	}
}
