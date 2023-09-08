using Entities.DataModels;
using Entities.DtoModels;
using System.Linq.Expressions;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task<List<MachineDto>> GetMachinesByConditionAsync(MachineDtoForSearch machineDtoS);
		Task CreateMachineAsync(MachineDtoForCreate machineDtoC);
	}
}
