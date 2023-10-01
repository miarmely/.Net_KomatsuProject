using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.ViewModels;
using Repositories.Contracts;

namespace Repositories.Concretes
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(RepositoryContext context, IConfigManager configs)
            : base(context, configs)
        {}

        public async Task<ErrorDto?> CreateUserAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.User_Create,
                parameters);

        public async Task<IEnumerable<UserView>?> GetAllUsersWithPagingAsync(
            DynamicParameters parameters)
        {
            #region get userViews
            var userViewDict = new Dictionary<Guid, UserView>();

            var userViews = await base.QueryAsync<UserView, RolePartForUserView, UserView>(
                base.Configs.DbSettings.ProcedureNames.User_DisplayAll,
                parameters,
                (userViewPart, rolePart) =>
                {
                    #region add userView to dict if not exists
                    if (!userViewDict.TryGetValue(
                        key: userViewPart.UserId,
                        value: out var currentUserView))
                    {
                        currentUserView = userViewPart;
                        userViewDict.Add(userViewPart.UserId, currentUserView);
                    }
                    #endregion

                    #region add roleName to userView
                    currentUserView.RoleNames.Add(rolePart.RoleName);
                    #endregion

                    return currentUserView;
                },
                SplitOn: "RoleId");
            #endregion

            return userViewDict.Values;
        }

        public async Task<UserView?> GetUserByTelNoAsync(DynamicParameters parameters)
        {
            #region get userView
            UserView? userView = null;

            await base.QueryAsync<UserView, RolePartForUserView, UserView>(
                base.Configs.DbSettings.ProcedureNames.User_DisplayByTelNo,
                parameters,
                (userViewPart, rolePart) =>
                {
                    #region populate userView
                    userView = userViewPart;

                    // add roleNames
                    userView.RoleNames.Add(rolePart.RoleName);
                    #endregion

                    return userView;
                },
                "RoleId");
            #endregion

            return userView;
        }

        public async Task<ErrorDto?> UpdateUserByTelNoAsync(
            DynamicParameters parameters) =>  
                await base.QuerySingleOrDefaultAsync<ErrorDto>(
                    base.Configs.DbSettings.ProcedureNames.User_Update,
                    parameters);
        
        public async Task<ErrorDto> DeleteUsersByTelNoListAsync(
            DynamicParameters parameters) => 
                await base.QuerySingleOrDefaultAsync<ErrorDto>(
                    base.Configs.DbSettings.ProcedureNames.User_Delete,
                    parameters);
  

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

    }
}
