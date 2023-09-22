using Entities.DtoModels;
using System.Text.Json;

namespace Entities.Exceptions
{
	public class ErrorWithCodeException : Exception
	{
		public ErrorWithCodeException(
			int statusCode,
			string errorCode,
			string? errorDescription = null)
			: base(JsonSerializer.Serialize(new
			{
				StatusCode = statusCode,
				ErrorCode = errorCode,
				ErrorDescription = errorDescription,

			}))
		{ }

        public ErrorWithCodeException(ErrorDto errorDto)
            : base(JsonSerializer.Serialize(errorDto))
        { }
    }
}
