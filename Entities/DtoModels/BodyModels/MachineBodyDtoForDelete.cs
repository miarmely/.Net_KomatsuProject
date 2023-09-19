namespace Entities.DtoModels.BodyModels
{
    public record MachineBodyDtoForDelete
    {
        public IEnumerable<QueryData>? MachineInfos { get; init; }
    }

    public record QueryData(string? SubCategoryName, string? Model);
}
