using AutoMapper;
using Entities.DtoModels;
using Microsoft.AspNetCore.Diagnostics;
using Services.Contracts;
using System.Text.Json;

namespace Temsa_Api.Extensions
{
    public static class ErrorMiddlewareExtensions
	{
		public static void ConfigureExceptionHandler(
			this IServiceCollection services, 
			WebApplication app)
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
						#region get errorDto
						var errorMessage = contextFeature.Error.Message;
                        var errorDto = JsonSerializer.Deserialize<ErrorDto>(errorMessage);
                        #endregion

                        #region when unexpected error occured
                        if (errorDto.ErrorCode == null)
						{
							context.Response.StatusCode = 500;

                            await context.Response.WriteAsJsonAsync(new
                            {
                                StatusCode = 500,
								ErrorCode = "Internal Server Error",
                                ErrorDescription = errorMessage
                            });

							return;
                        }
                        #endregion

                        #region when expected error occured
                        context.Response.ContentType = "application/json";
                        context.Response.StatusCode = errorDto.StatusCode;

                        await context.Response.WriteAsJsonAsync(errorDto);
                        #endregion
                    }
                    #endregion
                })
			);
		}
	}
}
