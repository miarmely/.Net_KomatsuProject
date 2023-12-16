using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;


namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase
    {
        Task<UserView?> LoginAsync(DynamicParameters parameters); 
        Task<ErrorDto?> CreateUserAsync(DynamicParameters parameters);
        Task<UserView?> GetUserByTelNoAsync(DynamicParameters parameters);
        Task<IEnumerable<string>> GetAllRolesByLanguageAsync(DynamicParameters parameters);
        Task<ErrorDto?> UpdateUserByTelNoAsync(DynamicParameters parameters);
        Task<ErrorDto> DeleteUsersByTelNoListAsync(DynamicParameters parameters);

        Task<IEnumerable<UserView>?> GetAllUsersWithPagingAsync(
            DynamicParameters parameters);

        Task<FormView> GetAllFormsOfUserAsync();
	}
}
