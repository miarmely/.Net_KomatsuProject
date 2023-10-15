using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IMachineRepository : IRepositoryBase
	{
		public Task<ErrorDto?> CreateMachineAsync(DynamicParameters parameters);
        Task<ErrorDto?> UpdateMachineAsync(DynamicParameters parameters);
        Task<ErrorDto?> DeleteMachineAsync(DynamicParameters parameters);
        Task<IEnumerable<MachineView>> GetAllMachinesAsync(DynamicParameters parameters);
        Task<IEnumerable<MachineView>> GetMachinesByConditionAsync(
            DynamicParameters parameters);
        Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
            DynamicParameters parameters);
        Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
            DynamicParameters parameters);
		Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
			DynamicParameters parameters);
        Task<IEnumerable<string>> GetAllLanguagesAsync();


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
