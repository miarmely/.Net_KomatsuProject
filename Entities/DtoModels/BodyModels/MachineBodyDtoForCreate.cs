using Entities.DtoModels.EnumModels;

namespace Entities.DtoModels.BodyModels
{
    public class MachineBodyDtoForCreate
    {
        public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? BrandName { get; init; }
        public string? Model { get; init; }
        public int? Year { get; init; }
        public int? ZerothHandOrSecondHand { get; set; }
        public int? Stock { get; init; }
        public string? ImagePath { get; init; }
    }
}
