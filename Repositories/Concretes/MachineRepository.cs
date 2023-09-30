using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.QueryModels;
using Entities.ViewModels;
using Repositories.Contracts;
using System.Data;

namespace Repositories.Concretes
{
    public class MachineRepository : RepositoryBase<Machine>, IMachineRepository
    {
        private readonly IConfigManager _configs;

        public MachineRepository(RepositoryContext context, IConfigManager configs) 
            : base(context) =>
                _configs = configs;
         
        public async Task<ErrorDto> CreateMachineAsync(DynamicParameters parameters)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                #region create machine
                var errorDto = await connection.QuerySingleOrDefaultAsync<ErrorDto>(
                    _configs.DbSettings.ProcedureNames.Machine_Create,
                    parameters,
                    commandType: CommandType.StoredProcedure);
                #endregion

                return errorDto;
            }
        }

        public async Task<IEnumerable<MachineView>> GetAllMachinesAsync(
            DynamicParameters parameters)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                #region get machine views
                var machineViews = await connection.QueryAsync<MachineView>(
                    _configs.DbSettings.ProcedureNames.Machine_DisplayAll,
                    parameters,
                    commandType: CommandType.StoredProcedure);
                #endregion

                return machineViews;
            }
        }
        

        //     public async Task<MachineView?> GetMachineByMachineIdAsync(Guid machineId) =>
        //         await base
        //             .DisplayByCondition<MachineView>(m => m.Id.Equals(machineId))
        //             .SingleOrDefaultAsync();

        //     public async Task<MachineView?> GetMachineBySubCategoryNameAndModelAsync(
        //         string subCategoryName,
        //         string model) =>
        //             await base
        //                 .DisplayByCondition<MachineView>(m =>
        //                     m.SubCategoryName.Equals(subCategoryName)
        //                     && m.Model.Equals(model))
        //                 .SingleOrDefaultAsync();


        //     #region GetAllMachinesAsync

        //     public async Task<List<MachineView>> GetAllMachinesAsync() =>
        //         await base
        //             .DisplayAll<MachineView>()
        //             .ToListAsync();
        //     /*
        //* with pagination
        //*/
        //     public async Task<PagingList<MachineView>> GetAllMachinesAsync(
        //         PaginationQueryDto pagingParameters) =>
        //             await PagingList<MachineView>
        //                 .ToPagingListAsync(
        //                     base.DisplayAll<MachineView>(),
        //                     pagingParameters.PageNumber,
        //                     pagingParameters.PageSize);
        //     /*
        //* with pagination + orderBy
        //*/
        //     public async Task<PagingList<MachineView>> GetAllMachinesAsync<TResult>(
        //         PaginationQueryDto pagingParameters,
        //         Expression<Func<MachineView, TResult>> orderBy,
        //         bool asAscending = true) =>
        //             await PagingList<MachineView>
        //                 .ToPagingListAsync(
        //                     asAscending ?
        //                         base.DisplayAll<MachineView>().OrderBy(orderBy)
        //                         : base.DisplayAll<MachineView>().OrderByDescending(orderBy),
        //                     pagingParameters.PageNumber,
        //                     pagingParameters.PageSize);

        //     #endregion

        //     #region GetMachinesByConditionAsync
        //     public async Task<List<MachineView>> GetMachinesByConditionAsync(
        //         Expression<Func<MachineView, bool>> condition) =>
        //             await base
        //                 .DisplayByCondition<MachineView>(condition)
        //                 .ToListAsync();
        //     /*
        //* with pagination:
        //*/
        //     public async Task<PagingList<MachineView>> GetMachinesByConditionAsync(
        //         PaginationQueryDto paginationParameters,
        //         Expression<Func<MachineView, bool>> condition) =>
        //             await PagingList<MachineView>
        //                 .ToPagingListAsync(
        //                     base.DisplayByCondition<MachineView>(condition),
        //                     paginationParameters.PageNumber,
        //                     paginationParameters.PageSize);
        //     /*
        //* with pagination + orderBy:
        //*/
        //     public async Task<PagingList<MachineView>> GetMachinesByConditionAsync<TResult>(
        //         PaginationQueryDto paginationParameters,
        //         Expression<Func<MachineView, bool>> condition,
        //         Expression<Func<MachineView, TResult>> orderBy,
        //         bool asAscending = true) =>
        //             asAscending ?
        //                 await PagingList<MachineView>
        //                     .ToPagingListAsync(
        //                         base.DisplayByCondition<MachineView>(condition)
        //                             .OrderBy(orderBy),
        //                         paginationParameters.PageNumber,
        //                         paginationParameters.PageSize)

        //                 : await PagingList<MachineView>
        //                     .ToPagingListAsync(
        //                         base.DisplayByCondition<MachineView>(condition)
        //                             .OrderByDescending(orderBy),
        //                         paginationParameters.PageNumber,
        //                         paginationParameters.PageSize);
        //     #endregion
    }
}
