namespace Entities.DtoModels.Machine
{
    public class MachineDtoForCreate
    {
        public string? BrandName { get; init; }
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
        public bool IsSecondHand { get; init; }
        public string? ImagePath { get; init; }
        public int? Stock { get; init; }
        public int? Rented { get; init; }
        public int? Sold { get; init; }
        public int? Year { get; init; }
    }
}
