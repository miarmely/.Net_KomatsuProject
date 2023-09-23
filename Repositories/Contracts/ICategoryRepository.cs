using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface ICategoryRepository : IRepositoryBase<Category>
	{
		//Task<Category?> GetCategoryByIdAsync(
		//	int id, 
		//	bool trackChanges = false);
		//Task<List<Category>> GetCategoriesByMainCategoryIdAsync(
		//	int id,
		//	bool trackChanges = false);
		//Task<Category?> GetCategoryBySubCategoryNameAsync(
		//	string name,
		//	bool trackChanges = false);
	}
}
