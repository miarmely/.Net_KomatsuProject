namespace Entities.DtoModels.MachineDtos
{
    public record MachineDtoForDelete
    {
        public IEnumerable<Guid> MachineIdList { get; init; }
    }
}
