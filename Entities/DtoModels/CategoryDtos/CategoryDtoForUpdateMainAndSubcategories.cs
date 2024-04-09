using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels.CategoryDtos
{
	public record CategoryDtoForUpdateMainAndSubcategories
	{
		[Required] public string OldMainCategoryInEN { get; init; }  // base main category
		[Required] public List<string> OldSubCategoriesInEN { get; init; } // base subcategories
		public List<string>? OldSubCategoriesInTR { get; init; }
		public string? NewMainCategoryInEN { get; init; }
		public string? NewMainCategoryInTR { get; init; }
		public List<Subcategory>? NewSubCategoriesInEN { get; init; }
		public List<Subcategory>? NewSubCategoriesInTR { get; init; }
	}

	public record Subcategory
	{
        public string OldValue { get; init; }
		public string NewValue { get; init; }
	}
}