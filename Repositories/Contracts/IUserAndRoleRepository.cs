using Entities.RelationModels;

namespace Repositories.Contracts
{
	public interface IUserAndRoleRepository : IRepositoryBase<UserAndRole>
	{
		Task<List<UserAndRole>> GetUserAndRolesByUserIdAsync(
			Guid? id,
			bool trackChanges = false);

		Task<List<UserAndRole>> GetUserAndRolesByRoleIdAsync(
			int id,
			bool trackChanges = false);
	}
}
