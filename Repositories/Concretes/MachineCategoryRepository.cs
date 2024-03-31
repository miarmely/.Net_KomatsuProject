using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class MachineCategoryRepository : RepositoryBase, IMachineCategoryRepository
	{
        public MachineCategoryRepository(
            RepositoryContext context,
            IConfigManager configs) : base(context, configs)
        { }
        
        public async Task<ErrorDto> AddMainAndSubcategoriesAsync(
            DynamicParameters parameters) =>
                await base.ExecuteAsync(
                    base.Configs.DbSettings.ProcedureNames
                        .Machine_Category_AddMainAndSubCategories,
                    parameters);
    }
}