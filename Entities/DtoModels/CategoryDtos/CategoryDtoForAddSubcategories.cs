namespace Entities.DtoModels.CategoryDtos
{
	public record CategoryDtoForAddSubcategories
	{
		public string MainCategoryInEN { get; init; }  // base main category
		public List<string> SubcategoriesInEN { get; init; }
		public List<string> SubcategoriesInTR { get; init; }
	}
}