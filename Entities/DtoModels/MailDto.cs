namespace Entities.DtoModels
{
    public record MailDto
    {
        public string? DisplayName { get; init; }
        public string? From { get; init; }
        public ICollection<string> To { get; init; }
        public string Subject { get; init; }
        public string Body { get; init; }
    }
}
