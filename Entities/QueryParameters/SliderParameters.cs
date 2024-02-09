using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record SliderParametersForUploadToFolder : LanguageParams
	{
		[Required] public string FolderPathAfterWwwroot { get; init; }
	}

	public record SliderParametersForDisplayOne
	{
		[Required] public string Language { get; init; }
		[Required] public int SliderNo { get; init; }
	}

	public record SliderParamatersForDisplayAll
	{
		[Required] public string Language { get; init; }
	}

	public record SliderParametersForDeleteMultiple : SliderParametersForUploadToFolder
	{ }

	public record SliderParametersForDeleteOne : SliderParametersForUploadToFolder
	{
		[Required] public string FileName { get; init; }
	}
}
