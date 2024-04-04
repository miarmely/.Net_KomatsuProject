using Entities.DtoModels.CategoryDtos;
using Entities.QueryParameters;
using Entities.ViewModels;

namespace Services.Contracts
{
	public interface IMachineCategoryService
	{
		public Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto,
			LanguageParams languageParams);

		Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync();

		Task UpdateMainCategoryAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateMainCategory categoryDto);

		Task UpdateSubcategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateSubcategories categoryDto);

		Task UpdateMainAndSubcategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateMainAndSubcategories categoryDto);

		Task DeleteMainCategoryAsync(
			LanguageParams languageParams,
			CategoryDtoForDeleteMainCategory categoryDto);

		Task DeleteSubCategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForDeleteSubcategories categoryDto);
	}
}