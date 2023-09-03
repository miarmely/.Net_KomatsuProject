using Entities.DataModels;

namespace Repositories.Contracts
{
	public interface IBrandRepository : IRepositoryBase<Brand>
	{
		Task<List<Brand>> GetAllBrandsAsync(bool trackChanges);
		Task<Brand?> GetBrandByIdAsync(int id, bool trackChanges);
		Task<Brand?> GetBrandByNameAsync(string name, bool trackChanges);
	}
}
