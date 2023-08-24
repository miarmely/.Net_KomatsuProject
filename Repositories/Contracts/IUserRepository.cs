using Entities.DataModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IUserRepository : IRepositoryBase<User>
	{
		void CreateUser(User user);
		Task<List<User>> GetAllUsersAsync(bool trackChanges);
		Task<List<User>> GetAllUsersByOrderByAsync<T>(Expression<Func<User, T>> orderBy, bool trackChanges);
		Task<List<User>> GetUsersByConditionAsync(Expression<Func<User, bool>> expression, bool trackChanges);
		Task<List<User>> GetUsersByConditionByOrderByAsync<T>(Expression<Func<User, bool>> condition, Expression<Func<User, T>> orderBy, bool trackChanges);
		Task<User?> GetUserByIdAsync(int id, bool trackChanges);
		Task<User?> GetUserByTelNoAsync(string telNo, bool trackChanges);
		Task<User?> GetUserByEmailAsync(string email, bool trackChanges);
		void UpdateUser(User user);
		void DeleteUser(User user);
	}
}
