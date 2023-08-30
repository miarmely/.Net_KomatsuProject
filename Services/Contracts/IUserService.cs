using Entities.DtoModels;

namespace Services.Contracts
{
	public interface IUserService
	{
		Task<UserDto> LoginAsync(UserDtoForLogin userDtoL);
		Task<UserDto> RegisterAsync(UserDtoForRegister userDtoR);
	}
}
