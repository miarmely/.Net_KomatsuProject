using Entities.DataModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.RelationModels
{
	public class MainAndSubCategory
	{
		[Key]
		[Column(TypeName = "tinyint")]
		public int Id { get; set; }

		[Column(TypeName = "tinyint")]
		public int MainCategoryId { get; set; }

		[Column(TypeName = "tinyint")]
		public int SubCategoryId { get; set; }

		#region navigation properties
		[ForeignKey("MainCategoryId")]
		public MainCategory? MainCategory { get; set; }
		
		[ForeignKey("SubCategoryId")]
		public SubCategory? SubCategory { get; set; }
		#endregion
	}
}
