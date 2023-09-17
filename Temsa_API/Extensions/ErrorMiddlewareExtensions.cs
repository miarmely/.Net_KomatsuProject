using AutoMapper;
using Entities.DtoModels;
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
						#region get error model from HttpContext
						var errorDtoForE = context.Items
							.Single(i => i.Key.Equals("errorDetails"))
							.Value
							as ErrorDtoForExceptionFilter;
						#endregion

						#region set logMessage
						var logMessage = JsonSerializer.Serialize(new
						{
							errorDtoForE.Controller,
							errorDtoForE.Action,
							errorDtoForE.ErrorCode,
							errorDtoForE.CreatedAt,
						});
						#endregion

						#region save log
						var loggerService = context.RequestServices
							.GetRequiredService<ILoggerService>();
						
						// for expected errors
						if (errorDtoForE.StatusCode != 500)
							loggerService.LogWarning(logMessage);

						// for unexpected errors
						else
							loggerService.LogError(logMessage);
						#endregion

						#region convert errorDtoForE to errorDto
						var mapper = context.RequestServices
						.GetRequiredService<IMapper>();

						var errorDto = mapper.Map<ErrorDto>(errorDtoForE);
						#endregion

						#region set response settings
						context.Response.ContentType = "application/json";
						context.Response.StatusCode = errorDtoForE.StatusCode;
						#endregion

						await context.Response.WriteAsJsonAsync(errorDto);
					}
					#endregion
				})
			);
		}
	}
}
