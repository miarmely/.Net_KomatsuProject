namespace Entities.DtoModels
{
    public class ErrorDtoForGlobalExceptionHandling : ErrorDto
    {
        public string Controller { get; set; }
        public string Action { get; set; }
        public DateTime CreatedAt { get; }

        public ErrorDtoForGlobalExceptionHandling() => CreatedAt = DateTime.UtcNow;
    }
}
