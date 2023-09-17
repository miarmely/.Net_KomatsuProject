namespace Entities.DtoModels.BodyModels
{
    public record UserBodyDtoForLogin
    {
        public string TelNo { get; init; }
        public string Password { get; init; }
    }
}
