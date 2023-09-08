using Entities.DtoModels.User;

namespace Services.Contracts
{
    public interface IUserService
	{
		Task<string> LoginAsync(UserDtoForLogin userDtoL);
		Task RegisterAsync(UserDtoForRegisterWithoutRole userDtoR, string roleName);
	}
}
