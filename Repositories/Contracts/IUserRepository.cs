using Entities.DataModels;
using Entities.QueryModels;
using Repositories.Utilies;
using System.Linq.Expressions;
using System.Runtime.InteropServices;

namespace Repositories.Contracts
{
	public interface IUserRepository : IRepositoryBase<User>
	{
		Task<User?> GetUserByIdAsync(Guid id, bool trackChanges = false);
		Task<User?> GetUserByTelNoAsync(string telNo, bool trackChanges = false);
		Task<User?> GetUserByEmailAsync(string email, bool trackChanges = false);
		Task<PagingList<User>> GetAllUsersAsync(
			PagingParameters pagingParameters, 
			bool trackChanges = false);
		Task<PagingList<User>> GetAllUsersAsync<T>
			(PagingParameters pagingParameters,
			Expression<Func<User, T>> orderBy, 
			bool asAscending = true, 
			bool trackChanges = false);
		Task<List<User>> GetUsersByConditionAsync(
			Expression<Func<User, bool>> condition,
			bool trackChanges = false);
		Task<List<User>> GetUsersByConditionAsync<T>(
			Expression<Func<User, bool>> condition, 
			Expression<Func<User, T>> orderBy, 
			bool asAscending = true, 
			bool trackChanges = false);		
	}
}
