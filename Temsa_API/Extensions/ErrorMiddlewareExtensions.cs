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
						var errorMessage = contextFeature.Error.Message;

                        try
                        {
                            #region get errorDto (catch)
                            var errorDto = JsonSerializer
                                .Deserialize<ErrorDto>(errorMessage);
                            #endregion

                            #region when expected error occured
                            context.Response.ContentType = "application/json";
                            context.Response.StatusCode = errorDto.StatusCode;

                            await context.Response.WriteAsJsonAsync(errorDto);
                            #endregion
                        }
                        catch(Exception ex)
                        {
                            #region when unexpected error occured
                            context.Response.StatusCode = 500;

                            await context.Response.WriteAsJsonAsync(new
                            {
                                StatusCode = 500,
                                ErrorCode = "ISE",
                                ErrorDescription = "Internal Server Error",
                                ErrorMessage = ex.Message
                            });
                            #endregion
                        }                        
                    }
                    #endregion
                })
			);
		}
	}
}
