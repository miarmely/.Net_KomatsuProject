using Dapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase<UserView>
    {
        Task<ErrorDto?> CreateUserAsync(DynamicParameters parameters);
        Task<IEnumerable<UserView>?> GetAllUsersAsync();

        Task<PagingList<UserView>?> GetAllUsersWithPagingAsync(
            PaginationQueryDto paginationQueryDto);

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
