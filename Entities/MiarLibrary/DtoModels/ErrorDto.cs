namespace Entities.DtoModels
{
	public record class ErrorDtoWithStatus
	{
		public int StatusCode { get; init; }
	}


	public record class ErrorDtoWithCode : ErrorDtoWithStatus
	{
		public string ErrorCode { get; init; }
		public string ErrorDescription { get; init; }
	}


	public record class ErrorDtoWithMessage : ErrorDtoWithCode
	{
		public string ErrorMessage { get; init; }
	}
}
