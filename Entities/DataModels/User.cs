using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class User
	{
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string FirstName { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string LastName { get; set; }

        [Column(TypeName = "smallint")]
        public int CompanyId { get; set; }

        [Column(TypeName = "char(10)")]
        public string TelNo { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Email { get; set; }
        
        [Column(TypeName = "varchar(20)")]
        public string Password { get; set; }
    }
}
