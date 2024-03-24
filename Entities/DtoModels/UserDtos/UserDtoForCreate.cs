namespace Entities.DtoModels.UserDtos
{
    public record UserDtoForCreate : UserDtoForRegister
    {
        public List<string>? RoleNames { get; } = new List<string>();
    }
}
