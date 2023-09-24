namespace Entities.QueryModels
{
    public record MachineQueryDtoForUpdate
    {
        public string? SubCategoryName { get; init; }
        public string? Model { get; init; }
    }
}
