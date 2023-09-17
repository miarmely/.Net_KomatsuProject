using Entities.Exceptions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Presantation.ActionFilters.Filters
{
	public class ValidationNullArgumentsFilter : IAsyncActionFilter
	{
		public async Task OnActionExecutionAsync(
			ActionExecutingContext context, 
			ActionExecutionDelegate next)
		{
			await Task.Run(() =>
			{
				#region get dtoModel in func parameter
				var dtoModel = context.ActionArguments
					.SingleOrDefault(a => a.Key.Contains("Dto"))
					.Value;
				#endregion

				#region get properties of dtoModel
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
						"Null Arguments");
				#endregion
			});

			await next();
		}
	}
}
