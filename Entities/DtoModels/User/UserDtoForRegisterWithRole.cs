namespace Entities.DtoModels.User
{
	public record UserDtoForRegisterWithRole : UserDtoForRegisterWithoutRole
	{
		public string RoleName { get; init; }
	}
}
