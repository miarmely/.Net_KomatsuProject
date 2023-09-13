namespace Entities.DtoModels
{
    public record UserDtoForConflictControl
    {
        public string TelNo { get; init; }
        public string Email { get; init; }
    }
}
