using Entities.RelationModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class UserAndRoleRepository : RepositoryBase<UserAndRole>
		, IUserAndRoleRepository
	{
        public UserAndRoleRepository(RepositoryContext context) 
			: base(context)
		{ }

		public void CreateUserAndRole(UserAndRole userAndRole) =>
			base.Create(userAndRole);

		public async Task<List<UserAndRole>> GetUserAndRolesByUserIdAsync(Guid? id, bool trackChanges)
			=> await base
				.FindWithCondition(ur => ur.UserId.Equals(id), false)
				.ToListAsync();

		public async Task<List<UserAndRole>> GetUserAndRolesByRoleIdAsync(int id, bool trackChanges) => await base
				.FindWithCondition(ur => ur.RoleId == id, trackChanges)
				.ToListAsync();
	}
}
