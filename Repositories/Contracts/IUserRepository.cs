using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase
    {
        Task<ErrorDto?> CreateUserAsync(DynamicParameters parameters);
        Task<ErrorDto?> UpdateUserByTelNoAsync(DynamicParameters parameters);
        Task<ErrorDto> DeleteUsersByTelNoListAsync(DynamicParameters parameters);
        Task<UserView?> GetUserByTelNoAsync(DynamicParameters parameters);

        Task<IEnumerable<UserView>?> GetAllUsersWithPagingAsync(
            DynamicParameters parameters);


  //      Task<List<UserView>> GetUsersByConditionAsync(
  //          Expression<Func<UserView, bool>> condition);

  //      Task<List<UserView>> GetUsersByConditionAsync(
  //          PaginationQueryDto paginationQueryDto,
  //          Expression<Func<UserView, bool>> condition);

		//Task<List<UserView>> GetUsersByConditionAsync<T>(
  //          PaginationQueryDto paginationQueryDto,
  //          Expression<Func<UserView, bool>> condition, 
		//	Expression<Func<UserView, T>> orderBy, 
		//	bool asAscending = true);		
	}
}
