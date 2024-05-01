using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;


namespace Repositories.Contracts
{
	public interface IMachineCategoryRepository
	{
		Task<ErrorDtoWithMessage> AddMainAndSubcategoriesAsync(DynamicParameters parameters);

		Task<ErrorDtoWithMessage> AddSubcategoriesAsync(
			DynamicParameters parameters);

		Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync(
			Func<MainCategoryPartForCategoryView,
				SubcategoryPartForCategoryView,
				CategoryView> map,
			string splitOn);

		Task<ErrorDtoWithMessage> UpdateMainCategoryAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage> UpdateSubcategoriesAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage> UpdateMainAndSubcategoriesAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage> DeleteMainCategoryAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage> DeleteSubcategoryAsync(
			DynamicParameters parameters);
	}
}