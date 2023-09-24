namespace Entities.DtoModels.UserDtos
{
    public record UserDtoForDelete
    {
        public IEnumerable<string> TelNoList { get; init; }
    }
}
