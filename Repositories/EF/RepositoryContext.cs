using Entities.DataModels;
using Microsoft.EntityFrameworkCore;

namespace Repositories.EF
{
	public class RepositoryContext : DbContext
	{
        private DbSet<User> Users { get; set; }
        private DbSet<Company> Companies { get; set; }

        public RepositoryContext(DbContextOptions options) : base(options)
        {}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			
		}
	}
}
