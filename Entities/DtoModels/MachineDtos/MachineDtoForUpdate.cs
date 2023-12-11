using Entities.Attributes;


namespace Entities.DtoModels.MachineDtos
{
	public record MachineDtoForUpdate
	{
		[MiarLength(1, 50)] public string? ImageName { get; init; }
		[MiarLength(1, 50)] public string? MainCategoryName { get; init; }
		[MiarLength(1, 50)] public string? SubCategoryName { get; init; }
		[MiarLength(1, 50)] public string? Model { get; init; }
		[MiarLength(1, 50)] public string? BrandName { get; init; }
		[MiarLength(1, 50)] public string? HandStatus { get; init; }
		[MiarLength(1, 50)] public string? PdfName { get; init; }
		[MiarRange(1, 1000)]public int? Stock { get; init; }
		[MiarRange(0, 1000)] public int? Rented { get; init; }
		[MiarRange(0, 1000)] public int? Sold { get; init; }
		[MiarRange(1900, 2099)] public int? Year { get; init; }
		[MiarLength(1, 2000)] public string? DescriptionInTR { get; init; }
		[MiarLength(1, 2000)] public string? DescriptionInEN { get; init; }
		public string? ImageContentInBase64Str { get; init; }
		public string? PdfContentInBase64Str { get; init; }
		public string? ImageFolderPathAfterWwwroot { get; init; }
		public string? PdfFolderPathAfterWwwroot { get; init; }
		public string? OldImageName { get; init; }
		public string? OldPdfName { get; init; }
	}
}
