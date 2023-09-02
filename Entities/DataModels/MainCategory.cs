using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class MainCategory
	{
		[Key]
		[Column(TypeName = "tinyint")]
		public int Id { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string Name { get; set; }

		[Column(TypeName = "varchar(60)")]
		public string ImagePath { get; set; }
	}
}
