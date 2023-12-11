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
       
        public async Task<ErrorDto?> CreateMachineAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.Machine_Create,
                parameters);

        public async Task<IEnumerable<MachineView>> GetAllMachinesAsync(
            DynamicParameters parameters,
            Func<MachineView, DescriptionPartForMachineView, MachineView> map,
            string splitOn) =>
                await base
                    .QueryAsync<MachineView, DescriptionPartForMachineView, MachineView>(
                        base.Configs.DbSettings.ProcedureNames.Machine_DisplayAll,
                        parameters,
                        map,
                        splitOn);

        public async Task<IEnumerable<MachineView>> GetMachinesByConditionAsync(
            DynamicParameters parameters) =>
                await base.QueryAsync<MachineView>(
                    base.Configs.DbSettings.ProcedureNames.Machine_DisplayByCondition,
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

        public async Task<IEnumerable<string>> GetAllLanguagesAsync() =>
            await base.QueryAsync<string>($@"
                SELECT  Name 
                FROM    {base.Configs.DbSettings.TableNames.Language}");

        public async Task<ErrorDto?> UpdateMachineAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<ErrorDto>(
                base.Configs.DbSettings.ProcedureNames.Machine_Update,
                parameters);

        public async Task<ErrorDto?> DeleteMachinesAsync(DynamicParameters parameters)
            => await base.QuerySingleOrDefaultAsync<ErrorDto>(
                    base.Configs.DbSettings.ProcedureNames.Machine_Delete,
                    parameters);

        public async Task SeparateValuesNotExistsOnTableAsync(
            DynamicParameters parameters) =>
                await base.QuerySingleOrDefaultAsync<int>(
                    base.Configs.DbSettings.ProcedureNames
                        .Machine_SeparateTheValuesNotExistsOnTable,
                    parameters);
	}
}
