using Entities.ErrorModels;
using System.Text.Json;


namespace Entities.Exceptions
{
	public class ErrorWithCodeException : Exception
	{
		public ErrorWithCodeException(int statusCode
			, string errorCode
			, string? errorDescription = null
			, string? message = null)
			: base(JsonSerializer.Serialize(new
			{
				StatusCode = statusCode,
				ErrorCode = errorCode,
				ErrorDescription = errorDescription,
				Message = message
			}))
		{ }

		public ErrorWithCodeException(ErrorWithCode errorModel)
			: base(JsonSerializer
				  .Serialize(errorModel))
		{ }
	}
}
