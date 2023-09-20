using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class CompanyRepository : RepositoryBase<Company>, ICompanyRepository
	{
		public CompanyRepository(RepositoryContext context) : base(context)
		{ }

		public async Task<List<Company>> GetAllCompaniesAsync(
			bool trackChanges = false) =>
				await base
					.DisplayAll<Company>(trackChanges)
					.OrderBy(c => c.Name)
					.ToListAsync();

		public async Task<Company?> GetCompanyByIdAsync(int id,
			bool trackChanges = false) =>
				await base.FindWithCondition(c => c.Id == id, trackChanges)
					.FirstOrDefaultAsync();

		public async Task<Company?> GetCompanyByNameAsync(string name,
			bool trackChanges = false) =>
				await base
					.FindWithCondition(c => c.Name.Equals(name), trackChanges)
					.FirstOrDefaultAsync();
	}
}
