using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using Repositories.Utilies;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase<Machine>
	{
		Task<MachineView?> GetMachineByMachineIdAsync(Guid machineId);

		Task<MachineView?> GetMachineByCategoryIdAndModelAsync(int categoryId, string model);

        #region GetAllMachines
        Task<List<MachineView>> GetAllMachinesAsync();

        Task<PagingList<MachineView>> GetAllMachinesAsync(
            PaginationQueryDto pagingParameters);

        Task<PagingList<MachineView>> GetAllMachinesAsync<TResult>(
            PaginationQueryDto pagingParameters,
            Expression<Func<MachineView, TResult>> orderBy,
            bool asAscending = true);
        #endregion

        #region GetMachinesByCndition
        Task<List<Machine>> GetMachinesByConditionAsync(
            Expression<Func<Machine, bool>> condition);

        Task<PagingList<Machine>> GetMachinesByConditionAsync(
            PaginationQueryDto paginationParameters,
            Expression<Func<Machine, bool>> condition);

        Task<PagingList<Machine>> GetMachinesByConditionAsync<TResult>(
            PaginationQueryDto paginationParameters,
            Expression<Func<Machine, bool>> condition,
            Expression<Func<Machine, TResult>> orderBy,
            bool asAscending = true);
        #endregion
    }
}
