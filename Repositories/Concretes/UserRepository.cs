using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
	public class UserRepository : RepositoryBase<User>, IUserRepository
	{
		public UserRepository(RepositoryContext context) : base(context)
		{ }

		public void CreateUser(User user) =>
			base.Create(user);

		public async Task<List<User>> GetAllUsersAsync(bool trackChanges) =>
			await base.FindAll(trackChanges)
				.OrderBy(u => u.Id)
				.ToListAsync();

		public async Task<List<User>> GetAllUsersByOrderByAsync<T>(
			Expression<Func<User, T>> orderBy
			, bool trackChanges) =>
				await base.FindAll(trackChanges)
					.OrderBy(orderBy)
					.ToListAsync();

		public async Task<List<User>> GetUsersByConditionAsync(
			Expression<Func<User, bool>> expression
			, bool trackChanges) =>
				await base.FindWithCondition(expression, trackChanges)
					.OrderBy(u => u.Id)
					.ToListAsync();

		public async Task<List<User>> GetUsersByConditionByOrderByAsync<T>(
			Expression<Func<User, bool>> condition
			, Expression<Func<User, T>> orderBy
			, bool trackChanges) =>
				await base.FindWithCondition(condition, trackChanges)
					.OrderBy(orderBy)
					.ToListAsync();

		public async Task<User?> GetUserByIdAsync(int id, bool trackChanges) =>
			await base.FindWithCondition(u => u.Id == id, trackChanges)
				.FirstOrDefaultAsync();

		public async Task<User?> GetUserByTelNoAsync(string telNo, bool trackChanges) =>
			await base.FindWithCondition(u => u.TelNo.Equals(telNo), trackChanges)
				.FirstOrDefaultAsync();

		public async Task<User?> GetUserByEmailAsync(string email, bool trackChanges) =>
			await base.FindWithCondition(u => u.Email.Equals(email), trackChanges)
				.FirstOrDefaultAsync();
		
		public void UpdateUser(User user) =>
			base.Update(user);

		public void DeleteUser(User user) =>
			base.Delete(user);
	}
}
