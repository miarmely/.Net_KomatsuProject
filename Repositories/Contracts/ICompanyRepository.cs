using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface ICompanyRepository : IRepositoryBase<Company>
	{
		Task<List<Company>> GetAllCompaniesAsync(bool trackChanges = false);
		Task<Company?> GetCompanyByIdAsync(int id, bool trackChanges = false);
		Task<Company?> GetCompanyByNameAsync(string name, bool trackChanges = false);
	}
}
