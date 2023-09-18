namespace Entities.ConfigModels
{
    public record SubCategoryNamesConfig
    {
        public WorkMachines MainCategoryNames { get; init; }
    }

    public record WorkMachines
    {
        public string MainCategoryNameInTR { get; init; }
        public IEnumerable<string> SubCategoryNames { get; init; }
    }
}
