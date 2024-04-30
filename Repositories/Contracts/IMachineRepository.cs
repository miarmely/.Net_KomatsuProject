using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase
	{
		public Task<ErrorDto?> CreateMachineAsync(DynamicParameters parameters);

        Task<ErrorDto?> UpdateMachineAsync(DynamicParameters parameters);

        Task<ErrorDto?> DeleteMachinesAsync(DynamicParameters parameters);

        Task<IEnumerable<string>> GetAllLanguagesAsync();

        Task<IEnumerable<MachineViewForPanel>> GetAllMachinesAsync(
            DynamicParameters parameters,
            Func<MachineViewForPanel, DescriptionPartOfMachineView, MachineViewForPanel> map,
            string splitOn);

        Task<IEnumerable<MachineViewForPanel>> GetMachinesByConditionAsync(
            DynamicParameters parameters);

		Task<IEnumerable<MachineViewForPanel>> GetOneMachineByIdForPanelAsync(
			DynamicParameters parameters,
			Func<MachineViewForPanel, DescriptionPartOfMachineView, MachineViewForPanel> map,
			string splitOn);

		Task<IEnumerable<MachineViewForMobile>> GetOneMachineByIdForMobileAsync(
			DynamicParameters parameters,
			Func<MachineViewForMobile, DescriptionPartOfMachineView, MachineViewForMobile> map,
			string splitOn);

		Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
            DynamicParameters parameters);

        Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
            DynamicParameters parameters);

		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
			DynamicParameters parameters);

        Task SeparateValuesNotExistsOnTableAsync(
            DynamicParameters parameters);
	}
}
