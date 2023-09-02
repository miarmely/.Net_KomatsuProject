using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
	public class MachineRepository : RepositoryBase<Machine>, IMachineRepository
	{
		public MachineRepository(RepositoryContext context) : base(context)
		{ }

		public void CreateMachine(Machine machine) =>
			base.Create(machine);

		public async Task<List<Machine>> GetAllMachinesAsync(bool trackChanges) =>
			await base
				.FindAll(trackChanges)
				.OrderBy(m => m.Id)
				.ToListAsync();

		public async Task<List<Machine>> GetMachinesByConditionAsync(
			Expression<Func<Machine, bool>> expression,
			bool trackChanges) =>
				await base
					.FindWithCondition(expression, trackChanges)
					.OrderBy(m => m.Id)
					.ToListAsync();

		public async Task<Machine?> GetMachineByMachineIdAsync(Guid machineId, bool trackChanges) =>
			await base
				.FindWithCondition(m => m.Id.Equals(machineId), trackChanges)
				.SingleOrDefaultAsync();

		public void UpdateMachine(Machine machine) =>
			base.Update(machine);

		public void RemoveMachine(Machine machine) =>
			base.Delete(machine);
	}
}
