using Entities.DtoModels;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
		Task<string> LoginAsync(UserDtoForLogin userDtoL);
		Task RegisterAsync(UserDtoForRegister userDtoR);
		Task CreateUserAsync(UserDtoForCreate userDtoC);
		Task<ICollection<UserDto>> GetAllUsersWithPagingAsync(
			PagingParameters pagingParameters, HttpResponse response);
	}
}
