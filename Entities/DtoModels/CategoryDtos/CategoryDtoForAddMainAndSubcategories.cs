namespace Entities.DtoModels.CategoryDtos
{
	public record CategoryDtoForAddMainAndSubcategories
	{
        public string MainCategoryInEN { get; init; }
		public string MainCategoryInTR { get; init; }
        public List<string> SubcategoriesInEN { get; init; }
		public List<string> SubcategoriesInTR { get; init; }
    }
}