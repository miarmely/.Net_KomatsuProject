using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;


namespace Services.Contracts
{
    public interface IUserService
	{
        Task<object> LoginForMobileAsync(string language, UserDtoForLogin userDto);
        Task<string> LoginForWebAsync(string language, UserDtoForLogin userDto);
        Task RegisterAsync(string language, UserDtoForRegister userDto);
        Task CreateUserAsync(string language, UserDtoForCreate userDto);
        Task<IEnumerable<string>> GetAllRolesByLanguageAsync(string language);

		Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
            LanguageAndPagingParams queryParams,
            HttpResponse response);

        Task UpdateUserByTelNoAsync(
            string language,
            string telNo,
            UserDtoForUpdateForPanel userDto);

		Task UpdateUserByTelNoAsync(
			string language,
			string telNo,
			UserDtoForUpdateForMobile userDto);

		Task DeleteUsersByTelNoListAsync(string language, UserDtoForDelete userDto);
	}
}
