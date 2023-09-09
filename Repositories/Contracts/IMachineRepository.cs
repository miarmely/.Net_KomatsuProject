using Entities.DataModels;
using Entities.QueryModels;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IMachineRepository : IRepositoryBase<Machine>
	{
		Task<PagingList<Machine>> GetAllMachinesAsync(
			PagingParameters pagingParameters,
			bool trackChanges = false);

		Task<PagingList<Machine>> GetAllMachinesAsync<TResult>(
			PagingParameters pagingParameters,
			Expression<Func<Machine, TResult>> orderBy, 
			bool asAscending = true, 
			bool trackChanges = false);

		Task<List<Machine>> GetMachinesByConditionAsync(
			Expression<Func<Machine, bool>> condition, 
			bool trackChanges = false);

		Task<List<Machine>> GetMachinesByConditionAsync<TResult>(
			Expression<Func<Machine, bool>> condition, 
			Expression<Func<Machine, TResult>> orderBy, 
			bool asAscending = true, 
			bool trackChanges = false);

		Task<Machine?> GetMachineByMachineIdAsync(
			Guid machineId, 
			bool trackChanges = false);
	}
}
