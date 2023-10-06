using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.ViewModels;
using Repositories.Contracts;

namespace Repositories.Concretes
{
    public class MachineRepository : RepositoryBase, IMachineRepository
    {
        public MachineRepository(RepositoryContext context, IConfigManager configs) 
            : base(context, configs)
        { }

        public async Task<ErrorDto> CreateMachineAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.Machine_Create,
                parameters);
        
        public async Task<IEnumerable<MachineView>> GetAllMachinesAsync(
            DynamicParameters parameters) =>
                await base.QueryAsync<MachineView>(
                    base.Configs.DbSettings.ProcedureNames.Machine_DisplayAll,
                    parameters);

        public async Task<ErrorDto?> UpdateMachineAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.Machine_Update,
                parameters);
        
        public async Task<ErrorDto?> DeleteMachineAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.Machine_Delete,
                parameters);

        public async Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
            DynamicParameters parameters) =>
                await base.QueryAsync<string>(
                    base.Configs.DbSettings.ProcedureNames.Machine_GetMainCategoryNames,
                    parameters);

        public async Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync
            (DynamicParameters parameters) =>
                await base.QueryAsync<string>(
                    base.Configs.DbSettings.ProcedureNames.Machine_GetSubCategoryNames,
                    parameters);

        public async Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
            DynamicParameters parameters)
                => await base.QueryAsync<string>(
                    base.Configs.DbSettings.ProcedureNames.Machine_GetAllHandStatus,
                    parameters);


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
