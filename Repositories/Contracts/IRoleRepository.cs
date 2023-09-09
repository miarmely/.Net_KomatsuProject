using Entities.DataModels;


namespace Repositories.Contracts
{
	public interface IRoleRepository : IRepositoryBase<Role>
	{
		Task<List<Role>> GetAllRolesAsync(bool trackChanges = false);
		Task<Role> GetRoleByIdAsync(int id, bool trackChanges = false);
		Task<Role> GetRoleByNameAsync(string name, bool trackChanges = false);
	}
}