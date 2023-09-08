using Entities.DataModels;
using Entities.DtoModels.Machine;

namespace Services.Contracts
{
    public interface IDataConverterService
	{
		Task<List<Machine>> MachineDtoToMachineAsync(List<MachineDto> machineDtoList);
		Task<Machine> MachineDtoToMachineAsync(MachineDto machineDto);
	}
}
