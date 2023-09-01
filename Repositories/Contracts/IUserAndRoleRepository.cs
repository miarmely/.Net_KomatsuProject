using Entities.RelationModels;

namespace Repositories.Contracts
{
	public interface IUserAndRoleRepository : IRepositoryBase<UserAndRole>
	{
		void CreateUserAndRole(UserAndRole userAndRole);
		Task<List<UserAndRole>> GetUserAndRolesByUserIdAsync(Guid? id, bool trackChanges);
		Task<List<UserAndRole>> GetUserAndRolesByRoleIdAsync(int id, bool trackChanges);
	}
}
