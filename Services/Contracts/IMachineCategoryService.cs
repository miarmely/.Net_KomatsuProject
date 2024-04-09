using Entities.DtoModels.CategoryDtos;
using Entities.QueryParameters;
using Entities.ViewModels;

namespace Services.Contracts
{
	public interface IMachineCategoryService
	{
		Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto,
			LanguageParams languageParams);

		Task AddSubcategoriesAsync(
			CategoryDtoForAddSubcategories categoryDto,
			LanguageParams languageParams);

		Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync();

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