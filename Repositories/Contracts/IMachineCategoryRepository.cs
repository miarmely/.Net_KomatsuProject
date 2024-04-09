using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;


namespace Repositories.Contracts
{
	public interface IMachineCategoryRepository
	{
		Task<ErrorDto> AddMainAndSubcategoriesAsync(DynamicParameters parameters);

		Task<ErrorDto> AddSubcategoriesAsync(
			DynamicParameters parameters);

		Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync(
			Func<MainCategoryPartForCategoryView,
				SubcategoryPartForCategoryView,
				CategoryView> map,
			string splitOn);

		Task<ErrorDto> UpdateMainCategoryAsync(
			DynamicParameters parameters);

		Task<ErrorDto> UpdateSubcategoriesAsync(
			DynamicParameters parameters);

		Task<ErrorDto> UpdateMainAndSubcategoriesAsync(
			DynamicParameters parameters);

		Task<ErrorDto> DeleteMainCategoryAsync(
			DynamicParameters parameters);

		Task<ErrorDto> DeleteSubcategoryAsync(
			DynamicParameters parameters);
	}
}