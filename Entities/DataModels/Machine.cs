using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class Machine
	{
		[Key]
		public int Id { get; set; }

		[Column(TypeName = "tinyint")]
		public int MachineCategoryId { get; set; }

		[Column(TypeName = "smallint")]
		public int MachineBrandId { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string Model { get; set; }
    }
}
