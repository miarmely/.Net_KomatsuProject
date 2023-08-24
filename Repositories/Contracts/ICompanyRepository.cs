using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface ICompanyRepository : IRepositoryBase<Company>
	{
		void CreateCompany(Company company);
		Task<List<Company>> GetAllCompanies(bool trackChanges);
		Task<Company?> GetCompanyById(int id, bool trackChanges);
		Task<Company?> GetCompanyByName(string name, bool trackChanges);
		void UpdateCompany(Company company);
		void DeleteCompany(Company company);
	}
}
