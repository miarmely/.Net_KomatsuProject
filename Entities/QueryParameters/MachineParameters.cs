using Entities.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record MachineParamsForUpdate
	{
		[Required][MiarLength(2, 2)] public string Language { get; init; }
		[Required] public Guid Id { get; init; }
		[Required] public string OldMainCategoryName { get; init; }
		[Required] public string OldSubCategoryName { get; init; }
	}

	public record MachineParamsForDisplaySubCategoryNames
	{
		[Required][MiarLength(2, 2)] public string Language { get; init; }
		[Required] public string? MainCategoryName { get; init; }
	}

	public record MachineParamsForCreate
	{
		[Required][MiarLength(2, 2)] public string Language { get; init; }
		[Required] public string ImageFolderPathAfterWwwroot { get; init; }
		[Required] public string PdfFolderPathAfterWwwroot { get; init; }
	}

	public record MachineParamsForDelete
	{
		[Required][MiarLength(2, 2)] public string Language { get; init; }
		[Required] public string ImageFolderPathAfterWwwroot { get; init; }
		[Required] public string PdfFolderPathAfterWwwroot { get; init; }
	}
}
