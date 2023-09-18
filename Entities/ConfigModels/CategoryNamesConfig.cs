namespace Entities.ConfigModels
{
    public record CategoryNamesConfig
    {
        public IEnumerable<string> MainCategoryNames { get; init; }
        public IEnumerable<IEnumerable<string>> SubCategoryNames { get; init; }
    }
}
