using Entities.DataModels.RelationModels;
using Entities.ViewModels;
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

        public async Task<List<UserAndRoleView>> GetUserAndRolesByUserIdAsync(Guid? id) =>
            await base
                .DisplayByCondition<UserAndRoleView>(ur => ur.UserId.Equals(id))
                .ToListAsync();

        public async Task<List<UserAndRoleView>> GetUserAndRolesByRoleNameAsync(
            string roleName) =>
                await base
                    .DisplayByCondition<UserAndRoleView>(ur => ur.RoleName.Equals(roleName))
                    .ToListAsync();
    }
}
