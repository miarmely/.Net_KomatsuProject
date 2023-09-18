using Entities.DataModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.EF.Configs
{
	public class CategoryConfiguration : IEntityTypeConfiguration<Category>
	{
		public void Configure(EntityTypeBuilder<Category> builder)
		{
			builder.HasData(
				new Category {
					Id = 1,
					MainCategoryId = 1,
					SubCategoryName =  "Paletli Ekskavatörler"
				},
				new Category
				{
					Id = 2,
					MainCategoryId = 1,
					SubCategoryName = "Lastikli Yükleyiciler"
				},
				new Category
				{
					Id = 3,
					MainCategoryId = 1,
					SubCategoryName = "Greyderler"
				},
				new Category
				{
					Id = 4,
					MainCategoryId = 1,
					SubCategoryName = "Dozerler"
				},
				new Category
				{
					Id = 5,
					MainCategoryId = 1,
					SubCategoryName = "Kazıcı Yükleyiciler"
				} 
			);
		}
	}
}
