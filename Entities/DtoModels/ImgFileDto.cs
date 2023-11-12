namespace Entities.DtoModels
{
    public record ImgFileDto
    {
        public string FileName { get; init; }
        public string ContentInBase64Str { get; init; }
    }
}
