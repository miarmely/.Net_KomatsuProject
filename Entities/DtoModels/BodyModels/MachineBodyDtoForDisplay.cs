using Entities.DtoModels.EnumModels;

namespace Entities.DtoModels.BodyModels
{
    public record MachineBodyDtoForDisplay
    {
        public string? BrandName { get; init; }
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
        public HandStatus? ZerothHandOrSecondHand { get; init; }
        public UsageStatus? SoldOrRented { get; init; }
        public int? Year { get; init; }
    }
}
