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
		
		public async Task<User?> GetUserByIdAsync(Guid id,
			bool trackChanges = false) =>
				await base
					.FindWithCondition(u => u.Id == id, trackChanges)
					.FirstOrDefaultAsync();

		public async Task<User?> GetUserByTelNoAsync(string telNo,
			bool trackChanges = false) =>
			await base
				.FindWithCondition(u => u.TelNo.Equals(telNo), trackChanges)
				.FirstOrDefaultAsync();

		public async Task<User?> GetUserByEmailAsync(string email,
			bool trackChanges = false) =>
			await base
				.FindWithCondition(u => u.Email.Equals(email), trackChanges)
				.FirstOrDefaultAsync();

		#region GetAllUsersAsync
		public async Task<List<User>> GetAllUsersAsync(bool trackChanges = false) =>
			await base
				.FindAll(trackChanges)
				.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<User>> GetAllUsersAsync<T>(
			Expression<Func<User, T>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await base.ControlOrderByAsync(
					base.FindAll(trackChanges),
					orderBy,
					asAscending);
		#endregion

		#region GetUsersByConditionAsync
		public async Task<List<User>> GetUsersByConditionAsync(
			Expression<Func<User, bool>> condition, 
			bool trackChanges = false) =>
			await base
				.FindWithCondition(condition, trackChanges)
				.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<User>> GetUsersByConditionAsync<T>(
			Expression<Func<User, bool>> condition,
			Expression<Func<User, T>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await ControlOrderByAsync(
					base.FindWithCondition(condition, trackChanges),
					orderBy,
					asAscending);
		#endregion
	}
}
