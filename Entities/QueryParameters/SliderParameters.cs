using System.ComponentModel.DataAnnotations;

namespace Entities.QueryParameters
{
	public record SliderParametersForDisplayOne
	{
		[Required] public string Language { get; init; }
		[Required] public string FolderPathAfterWwwroot { get; init; }
		[Required] public int SliderNo { get; init; }
	}

	public record SliderParamatersForDisplayAll
	{
		[Required] public string Language { get; init; }
		[Required] public string FolderPathAfterWwwroot { get; init; }
	}

	public record SliderParametersForDelete : SliderParamatersForDisplayAll
	{ }
}
