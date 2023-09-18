using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
    public class Machine
	{
		[Key]
		public Guid Id { get; set; }

		[Column(TypeName = "smallint")]
		public int BrandId { get; set; }

		[Column(TypeName = "smallint")]
		public int CategoryId { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string Model { get; set; }

		[Column(TypeName = "tinyint")]
        public int HandStatus { get; set; }

        [Column(TypeName = "varchar(60)")]
		public string ImagePath { get; set; }

		[Column(TypeName = "smallint")]
		public int Stock { get; set; }

		[Column(TypeName = "smallint")]
		public int Rented { get; set; }

		[Column(TypeName = "smallint")]
		public int Sold { get; set; }

		[Column(TypeName = "smallint")]
		public int Year { get; set; }

		public DateTime CreatedAt { get; set; }
		public bool IsDeleted { get; set; }

		#region navigation properties
		[ForeignKey("BrandId")]
		public Brand Brand { get; set; }

		[ForeignKey("CategoryId")]
		public Category? Category { get; set; }
		#endregion
	}
}
