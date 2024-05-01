using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.ViewModels;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class MachineCategoryRepository : RepositoryBase, IMachineCategoryRepository
	{
		public MachineCategoryRepository(
			RepositoryContext context,
			IConfigManager configs) : base(context, configs)
		{ }

		public async Task<ErrorDtoWithMessage> AddMainAndSubcategoriesAsync(
			DynamicParameters parameters) =>
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_AddMainAndSubCategories,
					parameters);

		public async Task<ErrorDtoWithMessage> AddSubcategoriesAsync(
			DynamicParameters parameters) =>
			await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_AddSubCategories,
					parameters);

		public async Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync(
			Func<MainCategoryPartForCategoryView,
				SubcategoryPartForCategoryView,
				CategoryView> map,
			string splitOn) =>
				await QueryAsync(
					Configs.DbSettings.ProcedureNames
						.M_C_DisplayAllMainAndSubcategories,
					null,
					map,
					splitOn);

		public async Task<ErrorDtoWithMessage> UpdateMainCategoryAsync(
			DynamicParameters parameters) =>
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_UpdateMainCategory,
					parameters);

		public async Task<ErrorDtoWithMessage> UpdateSubcategoriesAsync(
			DynamicParameters parameters) =>
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_UpdateSubcategories,
					parameters);

		public async Task<ErrorDtoWithMessage> UpdateMainAndSubcategoriesAsync(
			DynamicParameters parameters) =>
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_UpdateMainAndSubcategories,
					parameters);

		public async Task<ErrorDtoWithMessage> DeleteMainCategoryAsync(
			DynamicParameters parameters) =>
				await base.ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_DeleteMainCategory,
					parameters);

		public async Task<ErrorDtoWithMessage> DeleteSubcategoryAsync(
			DynamicParameters parameters) =>
				await base.ExecuteAsync(
					Configs.DbSettings.ProcedureNames.M_C_DeleteSubcategories,
					parameters);
	}
}