using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
	public class MainCategoryRepository 
		: RepositoryBase<MainCategory>, IMainCategoryRepository
	{
        public MainCategoryRepository(RepositoryContext context) : base(context)
        {}

		public async Task<MainCategory?> GetMainCategoryByIdAsync(int id, 
			bool trackChanges)
			=> await base
				.FindWithCondition(m => m.Id == id, trackChanges)
				.SingleOrDefaultAsync();

		public async Task<MainCategory?> GetMainCategoryByNameAsync(string name, 
			bool trackChanges)
			=> await base
				.FindWithCondition(m => m.Name.Equals(name), trackChanges)
				.SingleOrDefaultAsync();

		#region GetAllMainCategoriesAsync
		public async Task<List<MainCategory>> GetAllMainCategoriesAsync(
			bool trackChanges) => await base
				.FindAll(trackChanges)
				.ToListAsync();
		/*
		 * with orderBy
		 */
		public async Task<List<MainCategory>> GetAllMainCategoriesAsync<TResult>(
			Expression<Func<MainCategory, TResult>> orderBy, 
			bool asAscending = true, 
			bool trackChanges = false) =>
			await base
				.ControlOrderByAsync(
					base.FindAll(trackChanges),
					orderBy,
					asAscending);
		#endregion
	}
}
