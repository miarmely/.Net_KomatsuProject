using Entities.DataModels;
using Entities.RelationModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Repositories.EF.Configs;
using System.Reflection;

namespace Repositories.EF
{
	public class RepositoryContext : IdentityDbContext<UserWithIdentity>
	{
        private DbSet<User> Users { get; set; }
        private DbSet<Company> Companies { get; set; }
		private DbSet<Role> Roles { get; set; }
		private DbSet<UserAndRole> UsersAndRoles { get; set; }

		public RepositoryContext(DbContextOptions options) : base(options)
        {}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// to create all identity tables.
			base.OnModelCreating(modelBuilder);
			
			// apply all configuration
			modelBuilder.ApplyConfigurationsFromAssembly(Assembly
				.GetExecutingAssembly());
		}
	}
}
