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

		public async Task<ErrorDtoWithMessage?> CreateMachineAsync(DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
				base.Configs.DbSettings.ProcedureNames.M_Create,
				parameters);

		public async Task<IEnumerable<MachineViewForPanel>> GetAllMachinesAsync(
			DynamicParameters parameters,
			Func<MachineViewForPanel, DescriptionPartOfMachineView, MachineViewForPanel> map,
			string splitOn) =>
				await base.QueryAsync(
					base.Configs.DbSettings.ProcedureNames.M_DisplayAll,
					parameters,
					map,
					splitOn);

		public async Task<IEnumerable<MachineViewForPanel>> GetMachinesByConditionAsync(
			DynamicParameters parameters) =>
				await base.QueryAsync<MachineViewForPanel>(
					base.Configs.DbSettings.ProcedureNames.M_DisplayByCondition,
					parameters);

		public async Task<IEnumerable<MachineViewForPanel>> GetOneMachineByIdForPanelAsync(
			DynamicParameters parameters,
			Func<MachineViewForPanel, DescriptionPartOfMachineView, MachineViewForPanel> map,
			string splitOn) =>
				await base.QueryAsync(
					base.Configs.DbSettings.ProcedureNames.M_DisplayOneById,
					parameters,
					map,
					splitOn);

		public async Task<IEnumerable<MachineViewForMobile>> GetOneMachineByIdForMobileAsync(
			DynamicParameters parameters,
			Func<MachineViewForMobile, DescriptionPartOfMachineView, MachineViewForMobile> map,
			string splitOn) =>
				await base.QueryAsync(
					base.Configs.DbSettings.ProcedureNames.M_DisplayOneById,
					parameters,
					map,
					splitOn);
				
		public async Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
			DynamicParameters parameters) =>
				await base.QueryAsync<string>(
					base.Configs.DbSettings.ProcedureNames.M_GetMainCategoryNames,
					parameters);

		public async Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync
			(DynamicParameters parameters) =>
				await base.QueryAsync<string>(
					base.Configs.DbSettings.ProcedureNames.M_GetSubCategoryNames,
					parameters);

		public async Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
			DynamicParameters parameters)
				=> await base.QueryAsync<string>(
					base.Configs.DbSettings.ProcedureNames.M_GetAllHandStatus,
					parameters);

		public async Task<IEnumerable<string>> GetAllLanguagesAsync() =>
			await base.QueryAsync<string>($@"
                SELECT  Name 
                FROM    {base.Configs.DbSettings.TableNames.Language}");

		public async Task<ErrorDtoWithMessage?> UpdateMachineAsync(DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
				base.Configs.DbSettings.ProcedureNames.M_Update,
				parameters);

		public async Task<ErrorDtoWithMessage?> DeleteMachinesAsync(DynamicParameters parameters)
			=> await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
					base.Configs.DbSettings.ProcedureNames.M_Delete,
					parameters);

		public async Task SeparateValuesNotExistsOnTableAsync(
			DynamicParameters parameters) =>
				await base.QuerySingleOrDefaultAsync<int>(
					base.Configs.DbSettings.ProcedureNames
						.M_SeparateTheValuesNotExistsOnTable,
					parameters);
	}
}
