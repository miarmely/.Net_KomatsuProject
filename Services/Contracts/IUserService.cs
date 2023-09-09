using Entities.DtoModels;

namespace Services.Contracts
{
    public interface IUserService
	{
		Task<string> LoginAsync(UserDtoForLogin userDtoL);
		Task RegisterAsync(UserDtoForRegister userDtoR);
		Task CreateUserAsync(UserDtoForCreate userDtoC);
	}
}
