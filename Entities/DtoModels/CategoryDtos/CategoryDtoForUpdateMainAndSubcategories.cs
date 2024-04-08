using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels.CategoryDtos
{
	public class CategoryDtoForUpdateMainAndSubcategories
	{
		[Required] public string OldMainCategoryInEN { get; init; }
		[Required] public List<string> OldSubCategoriesInEN { get; init; } 
		public List<string>? OldSubCategoriesInTR { get; init; }
		public string? NewMainCategoryInEN { get; init; }
		public string? NewMainCategoryInTR { get; init; }
		public List<string>? NewSubCategoriesInEN { get; init; }
		public List<string>? NewSubCategoriesInTR { get; init; }
	}
}