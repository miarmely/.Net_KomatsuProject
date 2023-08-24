using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class CompanyRepository : RepositoryBase<Company>, ICompanyRepository
	{
        public CompanyRepository(RepositoryContext context) : base(context)
        {}

        public void CreateCompany(Company company) =>
			base.Create(company);

		public async Task<List<Company>> GetAllCompanies(bool trackChanges) =>
			await base.FindAll(trackChanges)
				.OrderBy(c => c.Id)
				.ToListAsync();

		public async Task<Company?> GetCompanyById(int id, bool trackChanges) =>
			await base.FindWithCondition(c => c.Id == id, trackChanges)
				.FirstOrDefaultAsync();

		public async Task<Company?> GetCompanyByName(string name, bool trackChanges) =>
			await base.FindWithCondition(c => c.Name.Equals(name), trackChanges)
				.FirstOrDefaultAsync();

		public void UpdateCompany(Company company) =>
			base.Update(company);

		public void DeleteCompany(Company company) =>
			base.Delete(company);
	}
}
