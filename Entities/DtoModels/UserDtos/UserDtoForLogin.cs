namespace Entities.DtoModels.UserDtos
{
    public record UserDtoForLogin
    {
        public string TelNo { get; init; }
        public string Password { get; init; }
    }
}
