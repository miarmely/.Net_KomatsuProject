using Entities.DataModels;
using Entities.DtoModels.Machine;
using System.Linq.Expressions;

namespace Services.Contracts
{
    public interface IMachineService
	{
		Task<List<MachineDto>> GetMachinesByConditionAsync(MachineDtoForSearch machineDtoS);
		Task CreateMachineAsync(MachineDtoForCreate machineDtoC);
	}
}
