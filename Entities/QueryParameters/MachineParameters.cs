using Entities.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record MachineParamsForUpdate : LanguageParam
	{
		[Required] public Guid Id { get; init; }
		[Required] public string OldMainCategoryName { get; init; }
		[Required] public string OldSubCategoryName { get; init; }
	}

	public record MachineParamsForDisplaySubCategoryNames : LanguageParam
	{
		[Required] public string? MainCategoryName { get; init; }
	}

	public record MachineParamsForCreate : LanguageParam
	{
		[Required] public string ImageFolderPathAfterWwwroot { get; init; }
		[Required] public string PdfFolderPathAfterWwwroot { get; init; }
	}

	public record MachineParamsForDelete : LanguageParam
	{
		[Required] public string ImageFolderPathAfterWwwroot { get; init; }
		[Required] public string PdfFolderPathAfterWwwroot { get; init; }
	}
}
