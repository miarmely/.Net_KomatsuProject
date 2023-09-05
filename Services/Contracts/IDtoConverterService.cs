using Entities.DataModels;
using Entities.DtoModels;

namespace Services.Contracts
{
	public interface IDtoConverterService
	{
		Task<List<MachineDto>> MachineToMachineDtoAsync(List<Machine> machines);
		Task<MachineDto> MachineToMachineDtoAsync(Machine machines);
		Task<List<Machine>> MachineDtoToMachineAsync(List<MachineDto> machineDtoList);
		Task<Machine> MachineDtoToMachineAsync(MachineDto machineDto);
	}
}
