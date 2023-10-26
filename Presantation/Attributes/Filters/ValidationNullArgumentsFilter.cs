using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Presantation.Attributes.Filters
{
	public class ValidationNullArgumentsFilter : IAsyncActionFilter
	{
		public async Task OnActionExecutionAsync(
			ActionExecutingContext context,
			ActionExecutionDelegate next)
		{
			#region control properties of dtoModels
			await Task.Run(() =>
			{
				#region get dtoModels in KeyValuePairs on parameter
				var keyValuePairs = context
					.ActionArguments
					.Where(a => a.Key.Contains("Dto"));
				#endregion

				#region get language on parameter
				var language = context.HttpContext.Request.Query
					.FirstOrDefault(q => q.Key.Equals("language"))
					.Value
					.ToString();
                #endregion

                foreach (var keyValuePair in keyValuePairs)
				{
					#region get properties of dtoModel
					var dtoModel = keyValuePair.Value;

					var properties = dtoModel
						.GetType()
						.GetProperties();
					#endregion

					#region control properties
					var isAllPropertiesNull = true;

					foreach (var property in properties)
					{
						#region when any property not null
						if (property.GetValue(dtoModel) != null)
						{
							isAllPropertiesNull = false;
							break;
						}
						#endregion
					}
					#endregion

					#region throw null arguments error
					if (isAllPropertiesNull)
						throw new ErrorWithCodeException(400,
							"NA",
							"Null Arguments",
                            GetErrorMessageOfNullArgumentByLanguage(language));
					#endregion
				}
			});
			#endregion

			await next();
		}

		private string GetErrorMessageOfNullArgumentByLanguage(string language)
		{
			return language switch
			{
				"TR" => "herhangi bir değer doldurulmadı",
				"EN" => "any input not filled"
			};
		}
	}
}
