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

		public async Task<Entities.ViewModels.UserView?> GetUserByIdAsync(Guid id) =>
			await base
				.DisplayByCondition<UserView>(u => u.Id == id)
				.FirstOrDefaultAsync();

		public async Task<Entities.ViewModels.UserView?> GetUserByTelNoAsync(string telNo) =>
			await base
				.DisplayByCondition<UserView>(u => u.TelNo.Equals(telNo))
				.FirstOrDefaultAsync();

		public async Task<Entities.ViewModels.UserView?> GetUserByEmailAsync(string email) =>
			await base
				.DisplayByCondition<UserView>(u => u.Email.Equals(email))
				.FirstOrDefaultAsync();


		#region GetAllUsersAsync

		public async Task<PagingList<Entities.ViewModels.UserView>> GetAllUsersAsync(
			PaginationQueryDto pagingParameters) =>
				await PagingList<Entities.ViewModels.UserView>
                    .ToPagingListAsync(
						base.DisplayAll<Entities.ViewModels.UserView>(),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		/*
		 * with orderBy:
		 */
		public async Task<PagingList<Entities.ViewModels.UserView>> GetAllUsersAsync<T>(
			PaginationQueryDto pagingParameters,
			Expression<Func<Entities.ViewModels.UserView, T>> orderBy,
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

		public async Task<List<Entities.ViewModels.UserView>> GetUsersByConditionAsync(
			PaginationQueryDto paginationQueryDto,
			Expression<Func<Entities.ViewModels.UserView, bool>> condition) =>
				await PagingList<Entities.ViewModels.UserView>
                    .ToPagingListAsync(
						base.DisplayByCondition<Entities.ViewModels.UserView>(condition),
						paginationQueryDto.PageNumber,
						paginationQueryDto.PageSize);
		/*
		 * with orderBy:
		 */
		public async Task<List<Entities.ViewModels.UserView>> GetUsersByConditionAsync<T>(
			PaginationQueryDto paginationQueryDto,
			Expression<Func<Entities.ViewModels.UserView, bool>> condition,
			Expression<Func<Entities.ViewModels.UserView, T>> orderBy,
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
