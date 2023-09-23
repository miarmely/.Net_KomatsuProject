using Entities.DataModels;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IMainCategoryRepository : IRepositoryBase<MainCategory>
	{
		//Task<List<MainCategory>> GetAllMainCategoriesAsync();
		//Task<List<MainCategory>> GetAllMainCategoriesAsync<TResult>(Expression<Func<MainCategory, TResult>> orderBy, bool asAscending = true);
		//Task<MainCategory?> GetMainCategoryByIdAsync(int id);
		//Task<MainCategory?> GetMainCategoryByNameAsync(string name);
	}
}
