namespace Entities.DtoModels
{
    public class ErrorDtoForExceptionFilter : ErrorDto
    {
        public string Controller { get; set; }
        public string Action { get; set; }
        public DateTime CreatedAt { get; }

        public ErrorDtoForExceptionFilter() => CreatedAt = DateTime.UtcNow;
    }
}
