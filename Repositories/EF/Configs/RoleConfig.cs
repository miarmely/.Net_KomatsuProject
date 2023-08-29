using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.EF.Configs
{
	public class RoleConfig : IEntityTypeConfiguration<Role>
	{
		public void Configure(EntityTypeBuilder<Role> builder)
		{
			builder.HasData(
				new Role() { Id = 1, Name = "User" },
				new Role() { Id = 2, Name = "Editor"},
				new Role() { Id = 3, Name = "Admin"});
		}
	}
}
