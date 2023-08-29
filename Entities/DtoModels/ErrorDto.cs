namespace Entities.DtoModels
{
	public record ErrorDto
	{
        public int StatusCode { get; init; }
		public string ErrorCode { get; init; }
		public string ErrorDescription { get; init; }
	}
}
