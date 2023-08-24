using Entities.DataModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IUserRepository : IRepositoryBase<User>
	{
		void CreateUser(User user);
		Task<List<User>> GetAllEmployeesAsync(bool trackChanges);
		Task<List<User>> GetAllEmployeesByOrderByAsync<T>(Expression<Func<User, T>> orderBy, bool trackChanges);
		Task<List<User>> GetEmployeesByConditionAsync(Expression<Func<User, bool>> expression, bool trackChanges);
		Task<List<User>> GetEmployeesByConditionByOrderByAsync<T>(Expression<Func<User, bool>> condition, Expression<Func<User, T>> orderBy, bool trackChanges);
		Task<User?> GetEmployeeByIdAsync(int id, bool trackChanges);
		Task<User?> GetEmployeeByTelNoAsync(string telNo, bool trackChanges);
		Task<User?> GetEmployeeByEmailAsync(string email, bool trackChanges);
		void UpdateEmployee(User user);
		void DeleteEmployee(User user);
	}
}
