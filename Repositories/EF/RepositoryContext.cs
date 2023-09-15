using Entities.DataModels;
using Entities.RelationModels;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Repositories.EF
{
    public class RepositoryContext : DbContext
	{
		private DbSet<User> Users { get; set; }
        private DbSet<Company> Companies { get; set; }
		private DbSet<Role> Roles { get; set; }
		private DbSet<UserAndRole> UsersAndRoles { get; set; }
		private DbSet<Machine> Machines { get; set; }
		private DbSet<Brand> Brands { get; set; }
		private DbSet<MainCategory> MainCategories { get; set; }
		private DbSet<Category> Categories { get; set; }

		public RepositoryContext(DbContextOptions options) : base(options)
        {}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// apply all configuration models
			modelBuilder.ApplyConfigurationsFromAssembly(Assembly
				.GetExecutingAssembly());
		}
	}
}
