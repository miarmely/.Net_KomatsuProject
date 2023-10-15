using Entities.DtoModels.EnumModels;

namespace Entities.DtoModels.MachineDtos
{
    public record MachineDtoForDisplay
    {
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? BrandName { get; init; }
        public string? Model { get; init; }
        public Int16? Stock { get; init; }
        public Int16? Rented { get; init; }
        public Int16? Sold { get; init; }
        public Int16? Year { get; init; }
        public string? HandStatus { get; init; }
    }
}
