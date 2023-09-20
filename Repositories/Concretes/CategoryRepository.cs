using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
	{
		public CategoryRepository(RepositoryContext context) : base(context)
		{ }

		public async Task<Category?> GetCategoryByIdAsync(
			int id,
			bool trackChanges = false) =>
				await base
					.DisplayByCondition<Category>(c => c.Id == id)
					.SingleOrDefaultAsync();
					
		public async Task<List<Category>> GetCategoriesByMainCategoryIdAsync(
			int id,
			bool trackChanges = false) =>
				await base
                    .DisplayByCondition<Category>(c => c.MainCategoryId == id)
					.ToListAsync();

		public async Task<Category?> GetCategoryBySubCategoryNameAsync(
			string name,
			bool trackChanges = false) =>
				await base
                    .DisplayByCondition<Category>(c => c.SubCategoryName.Equals(name))
					.SingleOrDefaultAsync();

	}
}
