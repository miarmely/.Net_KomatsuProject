using Dapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Entities.Exceptions;
using Entities.ViewModels;
using Repositories.Contracts;
using System.Data;
using System.Linq.Expressions;


namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
	{
		public UserRepository(DapperContext context) : base(context)
		{ }

		public async Task CreateUserAsync(
			string procedureName,
			DynamicParameters parameters)
        {
            #region create user
            using (var connection = _context.CreateSqlConnection())
			{
                await connection.QueryAsync(
					procedureName,
					parameters,
					commandType: CommandType.StoredProcedure);
			}
            #endregion
        }


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
