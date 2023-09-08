namespace Entities.DtoModels
{
    public record UserDtoForRegisterWithRole : UserDtoForRegisterWithoutRole
    {
        public string RoleName { get; init; }
    }
}
