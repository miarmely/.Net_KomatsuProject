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
					SubCategoryName =  "Paletli Ekskavatör"
				},
				new Category
				{
					Id = 2,
					MainCategoryId = 1,
					SubCategoryName = "Lastikli Ekskavatör"
				},
				new Category
				{
					Id = 3,
					MainCategoryId = 1,
					SubCategoryName = "Lastikli Yükleyici"
				},
				new Category
				{
					Id = 4,
					MainCategoryId = 1,
					SubCategoryName = "Dozer"
				},
				new Category
				{
					Id = 6,
					MainCategoryId = 1,
					SubCategoryName = "Kaya Kamyonu"
				} 
			);
		}
	}
}
