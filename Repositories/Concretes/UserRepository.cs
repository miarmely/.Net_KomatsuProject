using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
	{
		public UserRepository(RepositoryContext context) : base(context)
		{ }

		public async Task<User?> GetUserByIdAsync(
			Guid id,
			bool trackChanges = false) =>
				await base
					.FindWithCondition(u => u.Id == id, trackChanges)
					.FirstOrDefaultAsync();

		public async Task<User?> GetUserByTelNoAsync(
			string telNo,
			bool trackChanges = false) =>
			await base
				.FindWithCondition(u => u.TelNo.Equals(telNo), trackChanges)
				.FirstOrDefaultAsync();

		public async Task<User?> GetUserByEmailAsync(
			string email,
			bool trackChanges = false) =>
			await base
				.FindWithCondition(u => u.Email.Equals(email), trackChanges)
				.FirstOrDefaultAsync();

		#region GetAllUsersAsync
		public async Task<PagingList<User>> GetAllUsersAsync(
			PaginationQueryDto pagingParameters,
			bool trackChanges = false) =>
				await PagingList<User>
					.ToPagingListAsync(
						base.FindAll(trackChanges),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		/*
		 * with orderBy
		 */
		public async Task<PagingList<User>> GetAllUsersAsync<T>(
			PaginationQueryDto pagingParameters,
			Expression<Func<User, T>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await PagingList<User>
					.ToPagingListAsync(
						asAscending ?
							base.FindAll(trackChanges).OrderBy(orderBy)
							: base.FindAll(trackChanges).OrderByDescending(orderBy),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		
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
				asAscending ?
					await base
						.FindWithCondition(condition, trackChanges)
						.OrderBy(orderBy)
						.ToListAsync()
					: await base
						.FindWithCondition(condition, trackChanges)
						.OrderByDescending(orderBy)
						.ToListAsync();
		#endregion
	}
}
