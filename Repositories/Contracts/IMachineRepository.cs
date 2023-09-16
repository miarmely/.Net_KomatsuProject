using Entities.DataModels;
using Entities.QueryModels;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IMachineRepository : IRepositoryBase<Machine>
	{
		Task<List<Machine>> GetAllMachinesAsync(
			bool trackChanges = false);

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

		Task<PagingList<Machine>> GetMachinesByConditionAsync(
			PagingParameters paginationParameters,
			Expression<Func<Machine, bool>> condition,
			bool trackChanges = false);

		Task<PagingList<Machine>> GetMachinesByConditionAsync<TResult>(
			PagingParameters paginationParameters,
			Expression<Func<Machine, bool>> condition,
			Expression<Func<Machine, TResult>> orderBy,
			bool asAscending = true,
			bool trackChanges = false);

		Task<Machine?> GetMachineByMachineIdAsync(
			Guid machineId, 
			bool trackChanges = false);

		Task<Machine?> GetMachineByCategoryIdAndModelAsync(
			int categoryId,
			string model, 
			bool trackChanges = false);
	}
}
