using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class Category
	{
        [Key]
        public int Id { get; set; }
        public int MainCategoryId { get; set; }
        public int SubCategoryName { get; set; }

		#region navigation properties
		[ForeignKey("MainCategoryId")]
        public MainCategory? MainCategory { get; set; }
		#endregion
	}
}
