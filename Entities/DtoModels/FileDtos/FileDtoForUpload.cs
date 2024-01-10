using Entities.Attributes;
using Entities.Enums;
using Entities.QueryParameters;

namespace Entities.DtoModels.FileDtos
{
	public record FileDtoForUpload : LanguageParams
	{
        [MiarLength(1, 50, "Dosya Adı", "File Name")]
        public string FileName { get; init; }

        public string FolderPathAfterWwwroot { get; init; }
        public string FileContentInBase64Str { get; init; }
        public FileTypes FileType { get; init; }
    }
}
