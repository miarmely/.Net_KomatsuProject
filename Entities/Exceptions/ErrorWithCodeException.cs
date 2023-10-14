using Entities.DtoModels;
using System.Text.Json;

namespace Entities.Exceptions
{
	public class ErrorWithCodeException : Exception
	{
		public ErrorWithCodeException(
			int statusCode,
			string errorCode,
			string? errorDescription = null,
			string? errorMessage = null) 
			: base(JsonSerializer.Serialize(new
			{
				StatusCode = statusCode,
				ErrorCode = errorCode,
				ErrorDescription = errorDescription,
                ErrorMessage = errorMessage
            }))
		{ }

        public ErrorWithCodeException(ErrorDto errorDto)
            : base(JsonSerializer.Serialize(errorDto))
        { }
    }
}
