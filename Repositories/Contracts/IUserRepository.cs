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
        Task<ErrorDto?> UpdateUserByTelNoAsync(DynamicParameters parameters);
        Task<ErrorDto> DeleteUsersByTelNoListAsync(DynamicParameters parameters);
		Task CreateGeneralCommFormAsync(DynamicParameters parameters);
        Task CreateGetOfferFormAsync(DynamicParameters parameters);
        Task CreateRentingFormAsync(DynamicParameters parameters);

		Task<IEnumerable<UserView>?> GetAllUsersWithPagingAsync(
			DynamicParameters parameters);

		Task<IEnumerable<string>> GetAllRolesByLanguageAsync(
			DynamicParameters parameters);

		Task<TResult> GetAllFormsOfUserAsync<TResult>(
            string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync);
	}
}
