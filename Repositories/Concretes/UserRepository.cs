using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase<Entities.DataModels.User>, IUserRepository
	{
		public UserRepository(RepositoryContext context) : base(context)
		{ }

		public async Task<UserView?> GetUserByIdAsync(Guid id) =>
			await base
				.DisplayByCondition<UserView>(u => u.Id == id)
				.FirstOrDefaultAsync();

		public async Task<UserView?> GetUserByTelNoAsync(string telNo) =>
			await base
				.DisplayByCondition<UserView>(u => u.TelNo.Equals(telNo))
				.FirstOrDefaultAsync();

		public async Task<UserView?> GetUserByEmailAsync(string email) =>
			await base
				.DisplayByCondition<UserView>(u => u.Email.Equals(email))
				.FirstOrDefaultAsync();


		#region GetAllUsersAsync

		public async Task<PagingList<UserView>> GetAllUsersAsync(
			PaginationQueryDto pagingParameters) =>
				await PagingList<UserView>
                    .ToPagingListAsync(
						base.DisplayAll<UserView>(),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		/*
		 * with orderBy:
		 */
		public async Task<PagingList<UserView>> GetAllUsersAsync<T>(
			PaginationQueryDto pagingParameters,
			Expression<Func<UserView, T>> orderBy,
			bool asAscending = true) =>
				await PagingList<UserView>
					.ToPagingListAsync(
						asAscending ?
							base.DisplayAll<UserView>().OrderBy(orderBy)
							: base.DisplayAll<UserView>().OrderByDescending(orderBy),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);

        #endregion

        #region GetUsersByConditionAsync
        public async Task<List<UserView>> GetUsersByConditionAsync(
            Expression<Func<UserView, bool>> condition) =>
				await base
					.DisplayByCondition(condition)
					.ToListAsync();
		/*
		 * with pagination:
		 */
        public async Task<List<UserView>> GetUsersByConditionAsync(
			PaginationQueryDto paginationQueryDto,
			Expression<Func<UserView, bool>> condition) =>
				await PagingList<UserView>
                    .ToPagingListAsync(
						base.DisplayByCondition<UserView>(condition),
						paginationQueryDto.PageNumber,
						paginationQueryDto.PageSize);
		/*
		 * with pagination + orderBy:
		 */
		public async Task<List<UserView>> GetUsersByConditionAsync<T>(
			PaginationQueryDto paginationQueryDto,
			Expression<Func<UserView, bool>> condition,
			Expression<Func<UserView, T>> orderBy,
			bool asAscending = true) =>
                await PagingList<UserView>
				.ToPagingListAsync(
						asAscending ?
							base.DisplayByCondition<UserView>(condition)
								.OrderBy(orderBy)
							: base.DisplayByCondition<UserView>(condition)
								.OrderByDescending(orderBy),
                        paginationQueryDto.PageNumber,
                        paginationQueryDto.PageSize);

        #endregion
    }
}
