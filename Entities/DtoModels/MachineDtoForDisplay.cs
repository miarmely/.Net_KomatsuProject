namespace Entities.DtoModels
{
    public record MachineDtoForDisplay
    {
        public string? BrandName { get; init; }
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
        public bool? IsSecondHand { get; init; }
        public string? SoldOrRentedStatus { get; init; }  // "sold" or "rented"
        public int? Year { get; init; }
    }
}
