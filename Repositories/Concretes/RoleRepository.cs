using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class RoleRepository : RepositoryBase<Role>, IRoleRepository
	{
		public RoleRepository(RepositoryContext context) : base(context)
		{ }

		public async Task<List<Role>> GetAllRolesAsync() =>
			await base
				.DisplayAll<Role>()
				.ToListAsync();

		public async Task<Role?> GetRoleByIdAsync(int id) =>
			await base
				.DisplayByCondition<Role>(r => r.Id == id)
				.SingleOrDefaultAsync();

		public async Task<Role?> GetRoleByNameAsync(string name) =>
			await base
				.DisplayByCondition<Role>(r => r.Name.Equals(name))
				.SingleOrDefaultAsync();
	}
}