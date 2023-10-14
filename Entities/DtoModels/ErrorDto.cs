namespace Entities.DtoModels
{
    public record class ErrorDto
    {
        public int StatusCode { get; init; }
        public string ErrorCode { get; init; }
        public string ErrorDescription { get; init; }
        public string ErrorMessage { get; init; }
    }
}
