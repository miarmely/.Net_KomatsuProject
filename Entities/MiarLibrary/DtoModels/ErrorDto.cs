namespace Entities.DtoModels
{
	public record class ErrorDtoWithStatus
	{
		public int StatusCode { get; init; }
	}


	public record class ErrorDtoWithCode
	{
		public int StatusCode { get; init; }
		public string? ErrorCode { get; init; }
		public string? ErrorDescription { get; init; }
	}


	public record class ErrorDtoWithMessage 
	{
		public int StatusCode { get; init; }
		public string? ErrorCode { get; init; }
		public string? ErrorDescription { get; init; }
		public string? ErrorMessage { get; init; }
	}
}
