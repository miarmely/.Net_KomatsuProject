using Entities.DtoModels;
using System.Text.Json;


namespace Entities.Exceptions
{
	public class ExceptionWithStatus : Exception
	{
		public ExceptionWithStatus(int statusCode) : base(JsonSerializer
			.Serialize(new
			{
				StatusCode = statusCode
			}))
		{ }

		public ExceptionWithStatus(ErrorDtoWithStatus errorDto)
			: base(JsonSerializer.Serialize(errorDto))
		{ }
	}
}
