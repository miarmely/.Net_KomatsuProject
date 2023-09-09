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

		public async Task<List<Role>> GetAllRolesAsync(bool trackChanges = false) =>
			await base
				.FindAll(trackChanges)
				.ToListAsync();

		public async Task<Role> GetRoleByIdAsync(
			int id, 
			bool trackChanges = false) =>
			await base
				.FindWithCondition(r => r.Id == id, trackChanges)
				.SingleAsync();

		public async Task<Role> GetRoleByNameAsync(
			string name, 
			bool trackChanges = false) =>
			await base
				.FindWithCondition(r => r.Name.Equals(name), trackChanges)
				.SingleAsync();
	}
}