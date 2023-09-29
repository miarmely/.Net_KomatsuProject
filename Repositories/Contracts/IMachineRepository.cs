using Dapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase<Machine>
	{
		public Task<ErrorDto> CreateMachineAsync(DynamicParameters parameters);
        Task<IEnumerable<MachineView>> GetAllMachinesAsync(DynamicParameters parameters);


        //Task<MachineView?> GetMachineByMachineIdAsync(Guid machineId);

        //Task<MachineView?> GetMachineBySubCategoryNameAndModelAsync(
        //          string subCategoryName, 
        //          string model);


        //      #region GetAllMachines
        //      Task<PagingList<MachineView>> GetAllMachinesAsync<TResult>(
        //          PaginationQueryDto pagingParameters,
        //          Expression<Func<MachineView, TResult>> orderBy,
        //          bool asAscending = true);

        //      #endregion

        //      #region GetMachinesByCndition

        //      Task<List<MachineView>> GetMachinesByConditionAsync(
        //          Expression<Func<MachineView, bool>> condition);

        //      Task<PagingList<MachineView>> GetMachinesByConditionAsync(
        //          PaginationQueryDto paginationParameters,
        //          Expression<Func<MachineView, bool>> condition);

        //      Task<PagingList<MachineView>> GetMachinesByConditionAsync<TResult>(
        //          PaginationQueryDto paginationParameters,
        //          Expression<Func<MachineView, bool>> condition,
        //          Expression<Func<MachineView, TResult>> orderBy,
        //          bool asAscending = true);

        //      #endregion
    }
}
