using Entities.DataModels.RelationModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IUserAndRoleRepository : IRepositoryBase<UserAndRole>
	{
		Task<List<UserAndRoleView>> GetUserAndRolesByUserIdAsync(Guid? id);
		Task<List<UserAndRoleView>> GetUserAndRolesByRoleNameAsync(string roleName);
	}
}
