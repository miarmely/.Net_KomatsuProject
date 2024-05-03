namespace Entities.DtoModels.UserDtos
{
    public record UserDtoForCreate : UserDtoForRegister
    {
        public List<string> RoleNames { get; }

        public UserDtoForCreate() => RoleNames = new List<string>();
    }
}