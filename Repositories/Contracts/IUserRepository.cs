using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
    public interface IUserRepository : IRepositoryBase<Entities.DataModels.User>
    {
        Task<UserView?> GetUserByIdAsync(Guid id);
        Task<UserView?> GetUserByTelNoAsync(string telNo);
        Task<UserView?> GetUserByEmailAsync(string email);
        Task<PagingList<UserView>> GetAllUsersAsync(PaginationQueryDto pagingParameters);

		Task<PagingList<UserView>> GetAllUsersAsync<T>
			(PaginationQueryDto pagingParameters,
			Expression<Func<UserView, T>> orderBy, 
			bool asAscending = true);

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
