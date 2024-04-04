namespace Entities.ViewModels
{
	public record CategoryView
	{
        public string Language { get; init; }
        public string MainCategoryName { get; init; }
		public List<string> SubCategoryNames { get; } = new List<string>();
	}

	public record MainCategoryPartForCategoryView
	{
		public string Language { get; init; }
		public string MainCategoryName { get; init; }
	}

	public record SubcategoryPartForCategoryView
	{
		public string SubCategoryName { get; init; }
	}
}
