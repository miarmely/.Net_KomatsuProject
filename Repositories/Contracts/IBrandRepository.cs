using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface IBrandRepository : IRepositoryBase<Brand>
	{
		Task<List<Brand>> GetAllBrandsAsync(bool trackChanges = false);
		Task<Brand?> GetBrandByIdAsync(int id, bool trackChange = false);
		Task<Brand?> GetBrandByNameAsync(string name, bool trackChanges = false);
	}
}
