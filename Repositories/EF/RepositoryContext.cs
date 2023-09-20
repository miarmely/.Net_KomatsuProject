using Entities.DataModels;
using Entities.DataModels.RelationModels;
using Entities.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Repositories.EF
{
    public class RepositoryContext : DbContext
    {
        #region DbSets
        private DbSet<Entities.DataModels.User> Users { get; set; }
        private DbSet<Company> Companies { get; set; }
        private DbSet<Role> Roles { get; set; }
        private DbSet<UserAndRole> UsersAndRoles { get; set; }
        private DbSet<Machine> Machines { get; set; }
        private DbSet<Brand> Brands { get; set; }
        private DbSet<MainCategory> MainCategories { get; set; }
        private DbSet<Category> Categories { get; set; }
        private DbSet<MachineView> MachineView { get; set; }
        private DbSet<Entities.ViewModels.UserView> UserView { get; set; }
        private DbSet<UserAndRoleView> UserAndRoleView { get; set; }
        #endregion

        public RepositoryContext(DbContextOptions options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region apply all configuration models
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly
                .GetExecutingAssembly());
            #endregion

            #region register views
            modelBuilder
                .Entity<MachineView>()
                .ToView(nameof(MachineView))
                .HasKey(w => w.Id);

            modelBuilder
                .Entity<UserView>()
                .ToView(nameof(UserView))
                .HasKey(u => u.Id);
            #endregion
        }
    }
}
