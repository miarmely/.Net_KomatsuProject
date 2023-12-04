using Entities.DtoModels.MachineDtos;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task CreateMachineAsync(
            MachineParametersForCreate machineParams, 
            MachineDtoForCreate machineDto);

		Task<PagingList<MachineView>> GetAllMachinesAsync(
			string language,
			PaginationParameters paginationParameters,
			HttpResponse response);

		Task<PagingList<MachineView>> GetMachinesByConditionAsync(
			string language,
			PaginationParameters paginationParameters,
			MachineDtoForDisplay machineDto,
			HttpResponse response);

		Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(string language);

		Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
			MachineParametersForDisplaySubCategoryNames machineParameters);

		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(string language);

        Task<IEnumerable<string>> GetAllLanguagesAsync();

        Task UpdateMachineAsync(
            MachineParametersForUpdate parameters,
            MachineDtoForUpdate machineDto);

        Task DeleteMachineAsync(
            string language,
            MachineDtoForDelete machineDto);
    }
}
