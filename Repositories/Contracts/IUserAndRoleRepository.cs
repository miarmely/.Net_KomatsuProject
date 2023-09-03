using Entities.RelationModels;

namespace Repositories.Contracts
{
	public interface IUserAndRoleRepository : IRepositoryBase<UserAndRole>
	{
		Task<List<UserAndRole>> GetUserAndRolesByUserIdAsync(Guid? id, bool trackChanges);
		Task<List<UserAndRole>> GetUserAndRolesByRoleIdAsync(int id, bool trackChanges);
	}
}
