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
					Name = "İş Makineleri",
					ImagePath = "/Images/MainCategory/category1.png"
				},
				new MainCategory
				{
					Id = 2,
					Name = "Güç Makineleri",
					ImagePath = "/Images/MainCategory/category2.png"
				},
				new MainCategory
				{
					Id = 3,
					Name = "Yedek Parça",
					ImagePath = "/Images/MainCategory/category3.png"
				},
				new MainCategory
				{
					Id = 4,
					Name = "Hizmetler",
					ImagePath = "/Images/MainCategory/category4.png"
				});
		}
	}
}
