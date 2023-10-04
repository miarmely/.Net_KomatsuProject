namespace Entities.QueryParameters
{
    public record MachineParametersForUpdate
    {
        public string? Language { get; init; }
        public Guid? Id { get; init; }
    }

    public record MachineParametersForDisplaySubCategoryNames
    {
       public string? Language { get; init; }
       public string? MainCategoryName { get; init; }
    }
}
