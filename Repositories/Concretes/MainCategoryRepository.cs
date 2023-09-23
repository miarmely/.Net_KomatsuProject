using Entities.DataModels;
using Repositories.Contracts;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
	public class MainCategoryRepository 
		: RepositoryBase<MainCategory>, IMainCategoryRepository
	{
		public MainCategoryRepository(RepositoryContext context) : base(context)
		{ }

		//public async Task<MainCategory?> GetMainCategoryByIdAsync(int id) => 
		//	await base
		//		.FindWithCondition(m => m.Id == id, false)
		//		.SingleOrDefaultAsync();

		//public async Task<MainCategory?> GetMainCategoryByNameAsync(string name)=> 
		//	await base
		//		.FindWithCondition(m => m.Name.Equals(name), false)
		//		.SingleOrDefaultAsync();

		//#region GetAllMainCategoriesAsync
		//public async Task<List<MainCategory>> GetAllMainCategoriesAsync() => 
		//	await base
		//		.DisplayAll<MainCategory>()
		//		.AsNoTracking()
		//		.ToListAsync();
		///*
		// * with orderBy
		// */
		//public async Task<List<MainCategory>> GetAllMainCategoriesAsync<TResult>(
		//	Expression<Func<MainCategory, TResult>> orderBy,
		//	bool asAscending = true) =>
		//		asAscending ?
		//			await base
		//				.DisplayAll<MainCategory>()
		//				.AsNoTracking()
		//                      .OrderBy(orderBy)
		//				.ToListAsync()

		//			: await base
		//				.DisplayAll<MainCategory>()
		//				.AsNoTracking()
		//                      .OrderByDescending(orderBy)
		//				.ToListAsync();
		//#endregion
	}
}
