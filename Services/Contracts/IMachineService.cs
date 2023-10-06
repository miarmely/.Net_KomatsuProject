using Entities.DtoModels.MachineDtos;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task CreateMachineAsync(MachineDtoForCreate machineDto);
        Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(string language);
		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(string language);
		Task<PagingList<MachineView>> GetAllMachinesAsync(
            string language,
            PaginationParameters paginationParameters,
			HttpResponse response);
        Task UpdateMachineAsync(
            MachineParametersForUpdate parameters,
            MachineDtoForUpdate machineDto);
        Task DeleteMachineAsync(
            string language,
            MachineDtoForDelete machineDto);
        Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
            MachineParametersForDisplaySubCategoryNames machineParameters);


		//Task<IEnumerable<MachineDto>> GetMachinesByConditionWithPagingAsync(
		//	MachineBodyDtoForDisplay machineDtoD,
		//	PaginationQueryDto pagingParameters,
		//	HttpResponse response);

		//Task<IEnumerable<string>> GetSubCategoriesOfMainCategoryAsync(
		//	string mainCategoryName);

		//Task UpdateMachineAsync(
		//	MachineQueryDtoForUpdate machineQueryDtoU,
		//          MachineBodyDtoForUpdate machineBodyDtoU);

		//Task DeleteMachinesAsync(MachineBodyDtoForDelete machineQueryDto);
	}
}
