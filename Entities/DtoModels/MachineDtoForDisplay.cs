using Entities.DtoModels.Enums;

namespace Entities.DtoModels
{
    public record MachineDtoForDisplay
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
