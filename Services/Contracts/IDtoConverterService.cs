using Entities.DataModels;
using Entities.DtoModels.Machine;

namespace Services.Contracts
{
    public interface IDtoConverterService
	{
		Task<List<MachineDto>> MachineToMachineDtoAsync(List<Machine> machines);
		Task<MachineDto> MachineToMachineDtoAsync(Machine machines);

	}
}
