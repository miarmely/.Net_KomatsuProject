namespace Entities.DtoModels
{
    public record ImageFileDto
    {
        public string FileName { get; init; }
        public string ContentInBase64Str { get; init; }
    }
}
