using Entities.DtoModels.MachineDtos;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task CreateMachineAsync(MachineDtoForCreate machineDto);

		Task<IEnumerable<MachineDto>> GetAllMachinesAsync(
			PaginationParameters paginationParameters,
			HttpResponse response);

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
