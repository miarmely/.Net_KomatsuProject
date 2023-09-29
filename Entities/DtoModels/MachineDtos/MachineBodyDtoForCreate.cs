namespace Entities.DtoModels.MachineDtos
{
    public class MachineDtoForCreate
    {
        public string? Language { get; init; }
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
        public string? BrandName { get; init; }
        public int? Stock { get; init; }
        public int? Year { get; init; }
        public string? HandStatus { get; init; }
        public string? DescriptionInTR { get; init; }
        public string? DescriptionInEN { get; init; }
        public string? ImagePath { get; init; }
        public string? PdfPath { get; init; }
    }
}
