using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;


namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase
    {
        Task<UserView?> LoginAsync(DynamicParameters parameters); 
        Task<ErrorDtoWithMessage?> CreateUserAsync(DynamicParameters parameters);
        Task<UserView?> GetUserByTelNoAsync(DynamicParameters parameters);

		Task<IEnumerable<UserView>?> GetAllUsersWithPagingAsync(
			DynamicParameters parameters);

		Task<IEnumerable<string>> GetAllRolesByLanguageAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage?> UpdateUserByTelNoAsync(DynamicParameters parameters);

        Task<ErrorDtoWithMessage?> DeleteUsersByTelNoListAsync(DynamicParameters parameters);

		Task<ErrorDtoWithMessage> CloseAccountAsync(DynamicParameters parameters);
	}
}