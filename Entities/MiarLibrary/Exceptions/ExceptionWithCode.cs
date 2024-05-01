using Entities.DtoModels;
using System.Text.Json;


namespace Entities.Exceptions
{
	public class ExceptionWithCode : Exception
	{
		public ExceptionWithCode(
			int statusCode,
			string errorCode,
			string errorDescription)
			: base(JsonSerializer
				  .Serialize(new
				  {
					  StatusCode = statusCode,
					  ErrorCode = errorCode,
					  ErrorDescription = errorDescription,
				  }))
		{ }

		public ExceptionWithCode(ErrorDtoWithCode errorDto)
			: base(JsonSerializer.Serialize(errorDto))
		{ }
	}
}
