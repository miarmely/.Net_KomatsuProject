using Entities.DtoModels.MachineDtos;
using Entities.QueryModels;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task CreateMachineAsync(MachineDtoForCreate machineDto);

		Task<PagingList<MachineView>> GetAllMachinesAsync(
            string language,
            PaginationParameters paginationParameters,
			HttpResponse response);

        Task UpdateMachineAsync(
            MachineParametersForUpdate parameters,
            MachineDtoForUpdate machineDto);
        

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
