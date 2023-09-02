using Entities.DataModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IMachineRepository : IRepositoryBase<Machine>
	{
		void CreateMachine(Machine machine);
		Task<List<Machine>> GetAllMachinesAsync(bool trackChanges);
		Task<List<Machine>> GetMachinesByConditionAsync(Expression<Func<Machine, bool>> expression, bool trackChanges);
		Task<Machine?> GetMachineByMachineIdAsync(Guid machineId, bool trackChanges);
		void UpdateMachine(Machine machine);
		void RemoveMachine(Machine machine);
	}
}
