using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase
	{
		public Task<ErrorDto?> CreateMachineAsync(DynamicParameters parameters);
        Task<ErrorDto?> UpdateMachineAsync(DynamicParameters parameters);
        Task<ErrorDto?> DeleteMachineAsync(DynamicParameters parameters);
        Task<IEnumerable<string>> GetAllLanguagesAsync();
        Task<IEnumerable<MachineView>> GetAllMachinesAsync(
            DynamicParameters parameters,
            Func<MachineView, DescriptionPartForMachineView, MachineView> map,
            string splitOn);
        Task<IEnumerable<MachineView>> GetMachinesByConditionAsync(
            DynamicParameters parameters);
        Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
            DynamicParameters parameters);
        Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
            DynamicParameters parameters);
		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
			DynamicParameters parameters);
    }
}
