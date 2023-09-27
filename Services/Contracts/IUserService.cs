using Entities.DtoModels.UserDtos;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
        Task<string> LoginAsync(UserDtoForLogin userDto);
        Task RegisterAsync(UserDtoForRegister userDto);
        Task CreateUserAsync(UserDtoForCreate userDto);
		Task UpdateUserByTelNoAsync(string telNo, UserDtoForUpdate userDto);
        Task DeleteUsersByTelNoListAsync(UserDtoForDelete userDto);

        Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
            PaginationParameters pagingParameters,
            string language,
            HttpResponse response);


    }
}
