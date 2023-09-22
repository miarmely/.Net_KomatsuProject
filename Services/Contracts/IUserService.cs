using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
		Task<string> LoginAsync(UserBodyDtoForLogin userDtoL);
		Task CreateUserAsync(UserBodyDtoForCreate userDtoC);
		Task UpdateUserAsync(string email, UserBodyDtoForUpdate userDtoU);
		Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD);

        Task<ICollection<UserDto>> GetAllUsersAsync(
            PaginationQueryDto pagingParameters,
            HttpResponse response);
    }
}
