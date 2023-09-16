using Entities.DtoModels;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;

namespace Services.Contracts
{
	public interface IMachineService
	{
		Task CreateMachineAsync(MachineDtoForCreate machineDtoC);

		Task<IEnumerable<MachineDto>> GetAllMachinesWithPagingAsync(
			PagingParameters paginationParameters,
			HttpResponse response,
			bool trackChanges = false);

		Task<IEnumerable<MachineDto>> GetMachinesByConditionWithPagingAsync(
			MachineDtoForDisplay machineDtoD,
			PagingParameters pagingParameters,
			HttpResponse response);

		Task<IEnumerable<string>> GetSubCategoriesOfMainCategoryAsync(
			string mainCategoryName);

		Task UpdateMachineAsync(
			string subCategoryName, 
			string model, 
			MachineDtoForUpdate machineDtoU);
	}
}
