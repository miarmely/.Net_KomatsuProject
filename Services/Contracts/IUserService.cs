using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
		Task<string> LoginAsync(UserBodyDtoForLogin userDtoL);
		Task RegisterAsync(UserBodyDtoForRegister userDtoR);
		Task CreateUserAsync(UserBodyDtoForCreate userDtoC);
		Task<ICollection<UserDto>> GetAllUsersWithPagingAsync(
			PaginationQueryDto pagingParameters, HttpResponse response);
		Task UpdateUserAsync(string email, UserBodyDtoForUpdate userDtoU);
		Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD);
    }
}
