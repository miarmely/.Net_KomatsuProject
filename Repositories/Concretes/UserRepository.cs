using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.UserDtos;
using Entities.Exceptions;
using Entities.QueryModels;
using Entities.ViewModels;
using Repositories.Contracts;
using System.Collections.ObjectModel;
using System.Data;


namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase<UserView>, IUserRepository
    {
        private readonly IConfigManager _config;

        public UserRepository(RepositoryContext context,
            IConfigManager config) : base(context) =>
                _config = config;

        public async Task<ErrorDto?> CreateUserAsync(DynamicParameters parameters)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                #region create user
                var errorDto = await connection.QuerySingleOrDefaultAsync<ErrorDto>(
                    _config.DbSettings.ProcedureNames.User_Create,
                    parameters,
                    commandType: CommandType.StoredProcedure);
                #endregion

                return errorDto;
            }
        }

        public async Task<IEnumerable<UserView>?> GetAllUsersAsync() =>
            await BaseGetAllUsersAsync()
                as IEnumerable<UserView>;

        public async Task<PagingList<UserView>?> GetAllUsersWithPagingAsync(
            PaginationParameters paginationQueryDto) =>
            await BaseGetAllUsersAsync(paginationQueryDto)
                as PagingList<UserView>;

        public async Task DeleteUsersByTelNoListAsync(IEnumerable<string> telNoList)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                connection.Open();

                #region delete users in transaction
                using (var transaction = connection.BeginTransaction())
                {
                    #region delete users
                    foreach (var telNo in telNoList)
                    {
                        #region delete user
                        var errorDto = await connection
                            .QuerySingleOrDefaultAsync<ErrorDto>(
                                _config.DbSettings.ProcedureNames.User_Delete,
                                new { TelNo = telNo },
                                transaction: transaction,
                                commandType: CommandType.StoredProcedure);
                        #endregion

                        #region when telNo not found (throw)
                        if (errorDto != null)
                            throw new ErrorWithCodeException(errorDto);
                        #endregion
                    }
                    #endregion

                    // when any error not occured
                    transaction.Commit();
                }
                #endregion
            }
        }

        public async Task<ErrorDto?> UpdateUserByTelNoAsync(DynamicParameters parameters)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                #region update user
                var errorDto = await connection.QuerySingleOrDefaultAsync<ErrorDto>(
                    _config.DbSettings.ProcedureNames.User_Update,
                    parameters,
                    commandType: CommandType.StoredProcedure);
                #endregion

                return errorDto;
            }
        }


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
            PaginationParameters? paginationQueryDto = null)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            #region add totalCount parameter
            parameters.Add("TotalCount",
                0,
                DbType.Int64,
                ParameterDirection.Output);
            #endregion

            #region add pagination infos to parameters
            if (paginationQueryDto != null)
                parameters.AddDynamicParams(paginationQueryDto);
            #endregion

            #endregion

            #region get userViews
            IEnumerable<UserView> userViews;
            var userViewDict = new Dictionary<Guid, UserView>();

            using (var connection = _context.CreateSqlConnection())
            {
                #region get userViews with multi-mapping
                userViews = await connection
                    .QueryAsync<UserView, RolePartForUserView, UserView>(
                       _config.DbSettings.ProcedureNames.User_DisplayAll,
                       (userView, rolePart) =>
                       {
                           #region add userView to dict if not exists
                           if (!userViewDict.TryGetValue(
                               key: userView.UserId,
                               value: out var currentUserView))
                           {
                               currentUserView = userView;
                               userViewDict.Add(userView.UserId, currentUserView);
                           }
                           #endregion

                           #region add roleName to userView
                           currentUserView.RoleNames.Add(rolePart.RoleName);
                           #endregion

                           return currentUserView;
                       },
                       parameters,
                       splitOn: "RoleId",
                       commandType: CommandType.StoredProcedure);
                #endregion
            }
            #endregion

            #region return paginationList if wants
            if (paginationQueryDto != null
                && userViews != null)
            {
                // get totalCount from output parameter in database
                var totalCount = parameters.Get<Int64>("TotalCount");

                return await PagingList<UserView>.ToPagingListAsync(
                    userViewDict.Values,
                    totalCount,
                    paginationQueryDto.PageNumber,
                    paginationQueryDto.PageSize);
            }
            #endregion

            return userViewDict.Values;
        }

        #endregion
    }
}
