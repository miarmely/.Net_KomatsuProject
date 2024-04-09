namespace Entities.DtoModels.CategoryDtos
{
	public record CategoryDtoForDeleteSubcategories
	{
		public string MainCategoryInEN { get; init; }  // base main category
		public List<string> SubcategoriesInEN { get; init; }  // base subcategory
	}
}