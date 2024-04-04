namespace Entities.DtoModels.CategoryDtos
{
	public class CategoryDtoForUpdateSubcategories
	{
		public string OldMainCategoryInEN { get; init; }
		public List<string> OldSubCategoriesInEN { get; init; }
		public List<string>? OldSubCategoriesInTR { get; init; }
		public List<string>? NewSubCategoriesInEN { get; init; }
		public List<string>? NewSubCategoriesInTR { get; init; }
	}
}