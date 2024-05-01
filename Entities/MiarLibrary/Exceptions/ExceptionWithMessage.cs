using Entities.DtoModels;
using System.Text.Json;

namespace Entities.Exceptions
{
	public class ExceptionWithMessage : Exception
	{
		public ExceptionWithMessage(
			int statusCode,
			string errorCode,
			string errorDescription,
			string errorMessage) 
			: base(JsonSerializer.Serialize(new
			{
				StatusCode = statusCode,
				ErrorCode = errorCode,
				ErrorDescription = errorDescription,
                ErrorMessage = errorMessage
            }))
		{ }

        public ExceptionWithMessage(ErrorDtoWithMessage errorDto)
            : base(JsonSerializer.Serialize(errorDto))
        { }
    }
}
