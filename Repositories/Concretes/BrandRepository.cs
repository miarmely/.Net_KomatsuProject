using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class BrandRepository : RepositoryBase<Brand>, IBrandRepository
	{
		public BrandRepository(RepositoryContext context) : base(context)
		{}

		public async Task<List<Brand>> GetAllBrandsAsync(bool trackChanges = false) =>
			 await base
				.DisplayAll<Brand>(trackChanges)
				.OrderBy(b => b.Name)
				.ToListAsync();

		public async Task<Brand?> GetBrandByIdAsync(int id, 
			bool trackChanges = false) =>
				await base
					.FindWithCondition(b => b.Id == id, trackChanges)
					.SingleOrDefaultAsync();

		public async Task<Brand?> GetBrandByNameAsync(string name, 
			bool trackChanges = false) =>
				await base
					.FindWithCondition(b => b.Name.Equals(name), trackChanges)
					.FirstOrDefaultAsync();
		}
}
