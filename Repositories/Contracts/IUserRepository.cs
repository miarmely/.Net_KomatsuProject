using Dapper;
using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task CreateUserAsync(string procedureName, DynamicParameters parameters);

        Task<PagingList<UserView>> GetAllUsersAsync(PaginationQueryDto pagingParameters);

		Task<PagingList<UserView>> GetAllUsersAsync<T>
			(PaginationQueryDto pagingParameters,
			Expression<Func<UserView, T>> orderBy, 
			bool asAscending = true);
        Task<List<UserView>> GetUsersByConditionAsync(
            Expression<Func<UserView, bool>> condition);

        Task<List<UserView>> GetUsersByConditionAsync(
            PaginationQueryDto paginationQueryDto,
            Expression<Func<UserView, bool>> condition);

		Task<List<UserView>> GetUsersByConditionAsync<T>(
            PaginationQueryDto paginationQueryDto,
            Expression<Func<UserView, bool>> condition, 
			Expression<Func<UserView, T>> orderBy, 
			bool asAscending = true);		
	}
}
