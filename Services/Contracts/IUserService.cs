using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;


namespace Services.Contracts
{
	public interface IUserService
	{
		Task<object> LoginForMobileAsync(string language, UserDtoForLogin userDto);
		Task<string> LoginForWebAsync(string language, UserDtoForLogin userDto);
		Task<object> RegisterAsync(string language, UserDtoForRegister userDto);
		Task CreateUserAsync(string language, UserDtoForCreate userDto);
		Task<IEnumerable<string>> GetAllRolesByLanguageAsync(string language);

		Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
			LanguageAndPagingParams queryParams,
			HttpResponse response);

		Task<UserDto> GetUserByTelNoAsync(
			UserParamsForUpdate userParams);

		Task UpdateUserByTelNoAsync(
		string language,
		string telNo,
		UserDtoForUpdateForPanel userDto);

		Task<object> UpdateUserByTelNoAsync(
			string language,
			string telNo,
			UserDtoForUpdateForMobile userDto);

		Task DeleteUsersByTelNoListAsync(string language, UserDtoForDelete userDto);
	}
}
