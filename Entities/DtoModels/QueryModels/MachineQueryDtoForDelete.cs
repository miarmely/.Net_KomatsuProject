namespace Entities.DtoModels.QueryModels
{
	public record MachineQueryDtoForDelete
	{
		public IEnumerable<QueryData>? MachineInfos { get; init; }
	}

    public record QueryData(string? SubCategoryName, string? Model);
}
