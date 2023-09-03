using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
    public class CategoryRepository
		: RepositoryBase<Category>, ICategoryRepository
	{
		public CategoryRepository(RepositoryContext context) : base(context)
		{}

		public async Task<Category?> GetCategoryByIdAsync(
			int id, 
			bool trackChanges) => 
				await base
					.FindWithCondition(ms => ms.Id == id, trackChanges)
					.SingleOrDefaultAsync();

		public async Task<List<Category>> GetCategoriesByMainCategoryIdAsync(
			int id, 
			bool trackChanges) =>
				await base
					.FindWithCondition(c => c.MainCategoryId == id, trackChanges)
					.ToListAsync();

		public async Task<Category?> GetCategoryBySubCategoryNameAsync(
			string name, 
			bool trackChanges) =>
				await base
					.FindWithCondition(c => c.SubCategoryName.Equals(name), trackChanges)
					.SingleOrDefaultAsync();
	}
}
