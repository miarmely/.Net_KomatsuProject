using Entities.DtoModels.QueryModels;
using Entities.DtoModels.UserDtos;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
		//Task<string> LoginAsync(UserBodyDtoForLogin userDtoL);
		Task CreateUserAsync(UserDtoForCreate userDto);

		//Task UpdateUserAsync(string email, UserBodyDtoForUpdate userDtoU);
		//Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD);

        Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
            PaginationQueryDto pagingParameters,
            HttpResponse response);
    }
}
