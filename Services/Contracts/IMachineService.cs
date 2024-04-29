using Entities.DtoModels.MachineDtos;
using Entities.Enums;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories;

namespace Services.Contracts
{
	public interface IMachineService
	{
		Task CreateMachineAsync(
			LanguageParams languageParams,
			MachineDtoForCreate machineDto);

		Task UploadMachineFileToFolderAsync(
		   MachineParamsForUploadFile machineParams,
		   MachineDtoForUploadFile machineDto,
		   FileTypes fileType);

		Task<PagingList<MachineView>> GetAllMachinesAsync(
			string language,
			PaginationParams paginationParameters,
			HttpResponse response);

		Task<PagingList<MachineView>> GetMachinesByConditionAsync(
			string language,
			PaginationParams paginationParameters,
			MachineDtoForDisplay machineDto,
			HttpResponse response);

		Task<MachineView> GetOneMachineByIdAsync(
			MachineParamsForDisplayOneMachine machineParams);

		Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(string language);

		Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
			MachineParamsForDisplaySubCategoryNames machineParams);

		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(string language);

		Task<IEnumerable<string>> GetAllLanguagesAsync();

		Task UpdateMachineAsync(
			MachineParamsForUpdate parameters,
			MachineDtoForUpdate machineDto);

		Task DeleteMachineAsync(
			MachineParamsForDelete machineParams,
			IEnumerable<MachineDtoForDelete> machineDtos);

		Task UpdateMachineFileOnFolderAsync(
			MachineParamsForUpdateFile machineParams,
			MachineDtoForUploadFile machineDto,
			string columnNameInDb,
			FileTypes fileType);
	}
}
