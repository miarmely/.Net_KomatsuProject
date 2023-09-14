using Entities.DtoModels;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task<List<MachineDto>> GetMachinesByConditionAsync(MachineDtoForSearch machineDtoS);
		Task CreateMachineAsync(MachineDtoForCreate machineDtoC);
		Task<IEnumerable<string>> GetSubCategoriesOfMainCategoryAsync(
			string mainCategoryName);
	}
}
