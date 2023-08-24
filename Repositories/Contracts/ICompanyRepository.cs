using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface ICompanyRepository : IRepositoryBase<Company>
	{
		void CreateCompany(Company company);
		Task<List<Company>> GetAllCompaniesAsync(bool trackChanges);
		Task<Company?> GetCompanyByIdAsync(int id, bool trackChanges);
		Task<Company?> GetCompanyByNameAsync(string name, bool trackChanges);
		void UpdateCompany(Company company);
		void DeleteCompany(Company company);
	}
}
