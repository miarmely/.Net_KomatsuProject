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

                            // if error can be deserialize then this error is
                            // expected error. But when error can't be desirealize 
                            // then this error is unexpected error and not know that where 
                            // from throwed so this error should be show without desiralize
                            // at "catch"
                            #endregion

                            #region when expected error occured
                            context.Response.ContentType = "application/json";
                            context.Response.StatusCode = errorDto.StatusCode;

                            await context.Response.WriteAsJsonAsync(errorDto);
                            #endregion
                        }
                        catch(Exception ex)
                        {
                            #region when throwed error from unexpected place
                            context.Response.StatusCode = 500;

                            await context.Response.WriteAsJsonAsync(new
                            {
                                StatusCode = 500,
                                ErrorCode = "ISE",
                                ErrorDescription = "Internal Server Error",
                                ErrorMessage = errorMessage
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
