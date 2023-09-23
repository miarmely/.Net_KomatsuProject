using Dapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using Repositories.Contracts;
using System.Data;


namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase<UserView>, IUserRepository
    {
        public UserRepository(RepositoryContext context) : base(context)
        { }

        public async Task<ErrorDto> CreateUserAsync(DynamicParameters parameters)
        {
            #region create user
            using (var connection = _context.CreateSqlConnection())
            {
                var errorDto = await connection.QuerySingleOrDefaultAsync<ErrorDto>(
                    "User_Create",
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return errorDto;
            }
            #endregion
        }

        public async Task<IEnumerable<UserView>?> GetAllUsersAsync() =>
            await BaseGetAllUsersAsync()
                as IEnumerable<UserView>;

        public async Task<PagingList<UserView>?> GetAllUsersWithPagingAsync(
            PaginationQueryDto paginationQueryDto) =>
            await BaseGetAllUsersAsync(paginationQueryDto)
                as PagingList<UserView>;


        //      #region GetUsersByConditionAsync
        //      public async Task<List<UserView>> GetUsersByConditionAsync(
        //          Expression<Func<UserView, bool>> condition) =>
        //		await base
        //			.DisplayByCondition(condition)
        //			.ToListAsync();
        ///*
        // * with pagination:
        // */
        //      public async Task<List<UserView>> GetUsersByConditionAsync(
        //	PaginationQueryDto paginationQueryDto,
        //	Expression<Func<UserView, bool>> condition) =>
        //		await PagingList<UserView>
        //                  .ToPagingListAsync(
        //				base.DisplayByCondition<UserView>(condition),
        //				paginationQueryDto.PageNumber,
        //				paginationQueryDto.PageSize);
        ///*
        // * with pagination + orderBy:
        // */
        //public async Task<List<UserView>> GetUsersByConditionAsync<T>(
        //	PaginationQueryDto paginationQueryDto,
        //	Expression<Func<UserView, bool>> condition,
        //	Expression<Func<UserView, T>> orderBy,
        //	bool asAscending = true) =>
        //              await PagingList<UserView>
        //		.ToPagingListAsync(
        //				asAscending ?
        //					base.DisplayByCondition<UserView>(condition)
        //						.OrderBy(orderBy)
        //					: base.DisplayByCondition<UserView>(condition)
        //						.OrderByDescending(orderBy),
        //                      paginationQueryDto.PageNumber,
        //                      paginationQueryDto.PageSize);

        //      #endregion


        #region private

        private async Task<object> BaseGetAllUsersAsync(
            PaginationQueryDto? paginationQueryDto = null)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            #region add totalCount parameter
            var totalCount = 0;

            parameters.Add("TotalCount",
                totalCount,
                DbType.Int64,
                ParameterDirection.InputOutput);
            #endregion

            #region add pagination infos to parameters
            if (paginationQueryDto != null)
                parameters.AddDynamicParams(paginationQueryDto);
            #endregion

            #endregion

            #region get userViews
            IEnumerable<UserView>? userViews;
            var userViewDict = new Dictionary<Guid, UserView>();

            using (var connection = _context.CreateSqlConnection())
            {
                userViews = await connection
                    .QueryAsync<UserView, RolePartForUserView, UserView>(
                       "User_GetAll",
                       (userView, rolePart) =>
                       {
                           #region add userView to dict if not exists
                           if (!userViewDict.TryGetValue(
                               key: userView.Id,
                               value: out var currentUserView))
                           {
                               currentUserView = userView;
                               userViewDict.Add(userView.Id, currentUserView);
                           }
                           #endregion

                           #region add roleName to userView in dict
                           currentUserView.RoleNames.Add(rolePart.RoleName);
                           #endregion

                           return currentUserView;
                       },
                       parameters,
                       commandType: CommandType.StoredProcedure);
            }
            #endregion

            #region return paginationList if wanting pagination
            if (paginationQueryDto != null)
                return await PagingList<UserView>.ToPagingListAsync(
                    userViews,
                    totalCount,
                    paginationQueryDto.PageNumber,
                    paginationQueryDto.PageSize);
            #endregion

            return userViews;
        }

        #endregion
    }
}
