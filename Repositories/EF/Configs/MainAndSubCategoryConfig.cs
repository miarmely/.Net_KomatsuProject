using Entities.RelationModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repositories.EF.Configs
{
	public class MainAndSubCategoryConfig : IEntityTypeConfiguration<MainAndSubCategory>
	{
		public void Configure(EntityTypeBuilder<MainAndSubCategory> builder)
		{
			builder.HasData(
				new MainAndSubCategory
				{
					Id = 1,
					MainCategoryId = 1,
					SubCategoryId = 1
				},
				new MainAndSubCategory
				{
					Id = 2,
					MainCategoryId = 1,
					SubCategoryId = 2
				},
				new MainAndSubCategory
				{
					Id = 3,
					MainCategoryId = 1,
					SubCategoryId = 3
				},
				new MainAndSubCategory
				{
					Id = 4,
					MainCategoryId = 1,
					SubCategoryId = 4
				},
				new MainAndSubCategory
				{
					Id = 5,
					MainCategoryId = 1,
					SubCategoryId = 5
				});
		}
	}
}
