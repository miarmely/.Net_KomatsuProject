using Entities.DataModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IMainCategoryRepository : IRepositoryBase<MainCategory>
	{
		Task<List<MainCategory>> GetAllMainCategoriesAsync(bool trackChanges = false);
		Task<List<MainCategory>> GetAllMainCategoriesAsync<TResult>(Expression<Func<MainCategory, TResult>> orderBy, bool asAscending = true, bool trackChanges = false);
		Task<MainCategory?> GetMainCategoryByIdAsync(int id, bool trackChanges = false);
		Task<MainCategory?> GetMainCategoryByNameAsync(string name, bool trackChanges = false);
	}
}
