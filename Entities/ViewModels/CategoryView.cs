namespace Entities.ViewModels
{
	//public record CategoryView
	//{
	//	public string Language { get; init; }
	//	public string MainCategoryName { get; init; }
	//	public List<string> SubCategoryNames { get; } = new List<string>();
	//}

	//public record MainCategoryPartForCategoryView
	//{
	//	public string Language { get; init; }
	//	public string MainCategoryName { get; init; }
	//}

	//public record SubcategoryPartForCategoryView
	//{
	//	public string SubCategoryName { get; init; }
	//}

	public record CategoryView
	{
		public string BaseMainCategoryName { get; init; }
		public List<MainAndSubcategoriesByLanguage> MainAndSubcatsByLangs
		{ get; } = new List<MainAndSubcategoriesByLanguage>();
	}

	public record MainAndSubcategoriesByLanguage
	{
		public string Language { get; init; }
		public string MainCategoryName { get; init; }
		public List<string> SubcategoryNames { get; } = new List<string>();
	}

	public record MainCategoryPartForCategoryView
	{
		public string BaseMainCategoryName { get; init; }
		public string Language { get; init; }
		public string MainCategoryName { get; init; }
	}

	public record SubcategoryPartForCategoryView
	{
		public string SubcategoryName { get; init; }
	}
}