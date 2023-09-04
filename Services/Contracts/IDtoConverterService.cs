using Entities.DataModels;
using Entities.DtoModels;

namespace Services.Contracts
{
	public interface IDtoConverterService
	{
		Task<List<MachineDto>> MachineToMachineDtoAsync(List<Machine> machines);
	}
}
