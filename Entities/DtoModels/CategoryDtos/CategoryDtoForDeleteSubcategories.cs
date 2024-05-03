namespace Entities.DtoModels.CategoryDtos
{
	public record CategoryDtoForDeleteSubcategories
	{
		public string MainCategoryInEN { get; init; }
		public List<string> Subcategories { get; init; } 
	}
}