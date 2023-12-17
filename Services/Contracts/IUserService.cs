using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IUserService
	{
        Task<string> LoginForMobileAsync(string language, UserDtoForLogin userDto);
        Task<string> LoginForWebAsync(string language, UserDtoForLogin userDto);
        Task RegisterAsync(string language, UserDtoForRegister userDto);
        Task CreateUserAsync(string language, UserDtoForCreate userDto);
        Task DeleteUsersByTelNoListAsync(string language, UserDtoForDelete userDto);
        Task<IEnumerable<string>> GetAllRolesByLanguageAsync(string language);

        Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
            PaginationParameters pagingParameters,
            string language,
            HttpResponse response);

        Task UpdateUserByTelNoAsync(
            string language,
            string telNo,
            UserDtoForUpdate userDto);

        Task<FormViewForOneUser> GetAllFormsOfOneUserAsync(
            FormParamsForGetAllFormsOfOneUser formParams);
	}
}
