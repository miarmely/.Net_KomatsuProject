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

		public async Task<Machine?> GetMachineByMachineIdAsync(Guid machineId, bool trackChanges) =>
			await base
				.FindWithCondition(m => m.Id.Equals(machineId), trackChanges)
				.SingleOrDefaultAsync();

		#region GetAllMachinesAsync
		public async Task<List<Machine>> GetAllMachinesAsync(bool trackChanges = false) =>
			await base
				.FindAll(trackChanges)
				.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<Machine>> GetAllMachinesAsync<TResult>(
			Expression<Func<Machine, TResult>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await base
					.ControlOrderByAsync(
						base.FindAll(trackChanges),
						orderBy,
						asAscending);
		#endregion

		#region GetMachinesByConditionAsync
		public async Task<List<Machine>> GetMachinesByConditionAsync(
			Expression<Func<Machine, bool>> expression,
			bool trackChanges) =>
				await base
					.FindWithCondition(expression, trackChanges)
					.OrderBy(m => m.Id)
					.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<Machine>> GetMachinesByConditionAsync<TResult>(
			Expression<Func<Machine, bool>> condition,
			Expression<Func<Machine, TResult>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await base
					.ControlOrderByAsync(
						base.FindWithCondition(condition, trackChanges),
						orderBy,
						asAscending);
		#endregion
	}
}
