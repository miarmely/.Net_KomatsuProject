using Entities.DataModels.RelationModels;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IUserAndRoleRepository : IRepositoryBase<UserAndRole>
	{
		Task<List<UserAndRole>> GetUserAndRolesByUserIdAsync(Guid? id);
		Task<List<UserAndRole>> GetUserAndRolesByRoleIdAsync(int id);
		Task<List<string>> GetRoleNamesOfUserByUserIdAsync(Guid id);
	}
}
