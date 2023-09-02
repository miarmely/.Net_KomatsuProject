using Entities.RelationModels;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class Machine
	{
		[Key]
		public Guid Id { get; set; }

		[ForeignKey("BrandId")]
		[Column(TypeName = "smallint")]
		public int BrandId { get; set; }

		[Column(TypeName = "tinyint")]
		public int MainAndSubCategoryId { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string Model { get; set; }

		[Column(TypeName = "varchar(60)")]
		public string ImagePath { get; set; }

		[Column(TypeName = "smallint")]
		public int Stock { get; set; }

		[Column(TypeName = "smallint")]
		public int Hired { get; set; }

		[Column(TypeName = "smallint")]
		public int Saled { get; set; }

		[Column(TypeName = "smallint")]
		public int Year { get; set; }

		public DateTime RegistrationDate { get; set; }
		public bool IsDeleted { get; set; }

		#region navigation properties
		[ForeignKey("BrandId")]
		public Brand? Brand { get; set; }

		[ForeignKey("MainAndSubCategoryId")]
		public MainAndSubCategory? MainAndSubCategory { get; set; }
		#endregion
	}
}
