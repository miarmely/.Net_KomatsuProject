using AutoMapper;
using Entities.DtoModels;
using Entities.ErrorModels;
using Microsoft.AspNetCore.Diagnostics;
using Services.Contracts;

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
						#region get error model from HttpContext
						var errorModel = context.Request.HttpContext.Items
							.Single(i => i.Key.Equals("errorDetails"))
							.Value
							as ErrorDetails;
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
						// for expected errors
						if (context.Response.StatusCode != 500)
							loggerService.LogWarning(errorModel.LogDetails.ToString());

						// for unexpected errors
						else
							loggerService.LogError(errorModel.LogDetails.ToString());
						#endregion

						#region convert errorModel to errorDto
						var mapper = context.RequestServices
						.GetRequiredService<IMapper>();

						var errorDto = mapper.Map<ErrorDto>(errorModel);
						#endregion

						await context.Response.WriteAsJsonAsync(errorDto);
					}
					#endregion
				})
			);
		}
	}
}
