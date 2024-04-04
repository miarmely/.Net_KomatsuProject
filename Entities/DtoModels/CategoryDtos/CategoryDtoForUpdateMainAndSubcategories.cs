namespace Entities.DtoModels.CategoryDtos
{
	public class CategoryDtoForUpdateMainAndSubcategories
	{
		public string OldMainCategoryInEN { get; init; }
		public List<string> OldSubCategoriesInEN { get; init; }
		public List<string>? OldSubCategoriesInTR { get; init; }
		public string? NewMainCategoryInEN { get; init; }
		public string? NewMainCategoryInTR { get; init; }
		public List<string>? NewSubCategoriesInEN { get; init; }
		public List<string>? NewSubCategoriesInTR { get; init; }
	}
}