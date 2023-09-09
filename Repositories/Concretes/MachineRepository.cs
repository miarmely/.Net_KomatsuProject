using Entities.DataModels;
using Entities.QueryModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using Repositories.Utilies;
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
		/*
		 * default
		 */
		public async Task<PagingList<Machine>> GetAllMachinesAsync(
			PagingParameters pagingParameters,
			bool trackChanges = false) =>
				await PagingList<Machine>
					.ToPagingListAsync(
						base.FindAll(trackChanges),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		/*
		 * with orderBy
		 */
		public async Task<PagingList<Machine>> GetAllMachinesAsync<TResult>(
			PagingParameters pagingParameters,
			Expression<Func<Machine, TResult>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				await PagingList<Machine>
					.ToPagingListAsync(
						asAscending ?
							base.FindAll(trackChanges).OrderBy(orderBy)
							: base.FindAll(trackChanges).OrderByDescending(orderBy),
						pagingParameters.PageNumber,
						pagingParameters.PageSize);
		#endregion

		#region GetMachinesByConditionAsync
		/*
		 * default
		 */
		public async Task<List<Machine>> GetMachinesByConditionAsync(
			Expression<Func<Machine, bool>> expression,
			bool trackChanges) =>
				await base
					.FindWithCondition(expression, trackChanges)
					.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<Machine>> GetMachinesByConditionAsync<TResult>(
			Expression<Func<Machine, bool>> condition,
			Expression<Func<Machine, TResult>> orderBy,
			bool asAscending = true,
			bool trackChanges = false) =>
				asAscending ?
					await base
						.FindWithCondition(condition, trackChanges)
						.OrderBy(orderBy)
						.ToListAsync()
					: await base
						.FindWithCondition(condition, trackChanges)
						.OrderByDescending(orderBy)
						.ToListAsync();
		#endregion
	}
}
