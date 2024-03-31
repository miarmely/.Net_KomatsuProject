using Dapper;
using Entities.DtoModels;

namespace Repositories.Contracts
{
	public interface IMachineCategoryRepository
	{
		Task<ErrorDto> AddMainAndSubcategoriesAsync(DynamicParameters parameters);
	}
}