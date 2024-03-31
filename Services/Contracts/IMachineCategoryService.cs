using Entities.DtoModels.CategoryDtos;

namespace Services.Contracts
{
	public interface IMachineCategoryService
	{
		public Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto);
	}
}