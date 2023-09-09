namespace Entities.DtoModels
{
    public record UserDtoForCreate : UserDtoForRegister
    {
        public string RoleName { get; init; }
    }
}
