namespace Entities.DtoModels.BodyModels
{
    public record UserBodyDtoForCreate : UserBodyDtoForRegister
    {
        public string RoleName { get; init; }
    }
}
