using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
		//Task<string> LoginAsync(UserBodyDtoForLogin userDtoL);
		Task CreateUserAsync(UserBodyDtoForCreate userDtoC);

		//Task UpdateUserAsync(string email, UserBodyDtoForUpdate userDtoU);
		//Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD);

        Task<IEnumerable<UserView>> GetAllUsersAsync();

        Task<IEnumerable<UserView>> GetAllUsersWithPagingAsync(
            PaginationQueryDto pagingParameters,
            HttpResponse response);
    }
}
