using Entities.DtoModels.CategoryDtos;
using Entities.QueryParameters;

namespace Services.Contracts
{
	public interface IMachineCategoryService
	{
		public Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto,
			LanguageParams languageParams);
	}
}