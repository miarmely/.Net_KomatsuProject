using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Entities.ViewModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase<Machine>
	{
		Task<MachineView?> GetMachineByMachineIdAsync(Guid machineId);

		Task<MachineView?> GetMachineBySubCategoryNameAndModelAsync(
            string subCategoryName, 
            string model);


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

        Task<List<MachineView>> GetMachinesByConditionAsync(
            Expression<Func<MachineView, bool>> condition);

        Task<PagingList<MachineView>> GetMachinesByConditionAsync(
            PaginationQueryDto paginationParameters,
            Expression<Func<MachineView, bool>> condition);

        Task<PagingList<MachineView>> GetMachinesByConditionAsync<TResult>(
            PaginationQueryDto paginationParameters,
            Expression<Func<MachineView, bool>> condition,
            Expression<Func<MachineView, TResult>> orderBy,
            bool asAscending = true);

        #endregion
    }
}
