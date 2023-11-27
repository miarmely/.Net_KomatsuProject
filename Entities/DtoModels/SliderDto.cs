namespace Entities.DtoModels
{
    public record SliderDto
    {
        public string FolderPathAfterWwwroot { get; init; }
        public string FileName { get; init; }
        public string FileContentInBase64Str { get; init; }
    }
}
