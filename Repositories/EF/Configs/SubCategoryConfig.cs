using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.EF.Configs
{
	public class SubCategoryConfig : IEntityTypeConfiguration<SubCategory>
	{
		public void Configure(EntityTypeBuilder<SubCategory> builder)
		{
			builder.HasData(
				new SubCategory
				{
					Id = 1,
					Name = "Paletli Ekskavatörler",
					ImagePath = "/Images/SubCategory/category1.png"
				},
				new SubCategory
				{
					Id = 2,
					Name = "Lastikli Yükleyiciler",
					ImagePath = "/Images/SubCategory/category2.png"
				},
				new SubCategory
				{
					Id = 3,
					Name = "Greyderler",
					ImagePath = "/Images/SubCategory/category3.png"
				},
				new SubCategory
				{
					Id = 4,
					Name = "Dozerler",
					ImagePath = "/Images/SubCategory/category4.png"
				},
				new SubCategory
				{
					Id = 5,
					Name = "Kazıcı Yükleyiciler",
					ImagePath = "/Images/SubCategory/category5.png"
				});
		}
	}
}
