using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.EF.Configs
{
	public class MainCategoryConfig : IEntityTypeConfiguration<MainCategory>
	{
		public void Configure(EntityTypeBuilder<MainCategory> builder)
		{
			builder.HasData(
				new MainCategory
				{
					Id = 1,
					Name = "İş Makineleri"
				},
				new MainCategory
				{
					Id = 2,
					Name = "Güç Makineleri"
				},
				new MainCategory
				{
					Id = 3,
					Name = "Yedek Parça"
				},
				new MainCategory
				{
					Id = 4,
					Name = "Hizmetler"
				});
		}
	}
}
