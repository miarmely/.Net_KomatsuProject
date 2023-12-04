namespace Entities.DtoModels.MachineDtos
{
    public class MachineDtoForCreate
    {
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
        public string? BrandName { get; init; }
        public int? Stock { get; init; }
        public int? Year { get; init; }
        public string? HandStatus { get; init; }
        public string? DescriptionInTR { get; init; }
        public string? DescriptionInEN { get; init; }
        public string? ImageName { get; init; }
        public string? ImageContentInBase64Str { get; init; }
        public string? PdfName { get; init; }
		public string? PdfContentInBase64Str { get; init; }
	}
}
