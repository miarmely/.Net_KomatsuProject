using Entities.DataModels;


namespace Repositories.Contracts
{
	public interface IRoleRepository : IRepositoryBase<Role>
	{
		Task<Role> GetRoleByIdAsync(int id, bool trackChanges);
		Task<Role> GetRoleByNameAsync(string name, bool trackChanges);
	}
}