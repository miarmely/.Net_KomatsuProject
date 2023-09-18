namespace Entities.ConfigModels
{
    public record SubCategoryNamesConfig
    {
        public WorkMachines WorkMachines { get; init; }
    }

    public record WorkMachines
    {
        public string MainCategoryNameInTR { get; init; }
        public IEnumerable<string> SubCategoryNames { get; init; }
    }
}
