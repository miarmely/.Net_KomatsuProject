using Dapper;
using Entities.DtoModels.CategoryDtos;
using Entities.Exceptions;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;


namespace Services.Concretes
{
	public class MachineCategoryService : IMachineCategoryService
	{
		private readonly IRepositoryManager _repositories;

		public MachineCategoryService(IRepositoryManager repositories)
		{
			_repositories = repositories;
		}

		public async Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				MainCategoryInEN = categoryDto.MainCategoryInEN,
				MainCategoryInTR = categoryDto.MainCategoryInTR,
				SubCategoriesInTR = string.Join(',', categoryDto.SubcategoriesInTR),
				SubCategoriesInEN = string.Join(',', categoryDto.SubcategoriesInEN),
				SplitChar = ','
			});
			#endregion

			#region add main and subcategories
			var errorDto = await _repositories.MachineCategoryRepository
				.AddMainAndSubcategoriesAsync(parameters);

			// when any error is occured
			if (errorDto.ErrorCode != "")
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}
	}
}
