using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class Role
	{
        [Column(TypeName = "tinyint")]
        public int Id { get; set; }
		
		[Column(TypeName = "varchar(50)")]
		public string Name { get; set; }
    }
}
