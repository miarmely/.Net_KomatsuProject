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
        
        [Column(TypeName = "char(24)")]  // Convert.ToBase64String() length for text is 24.
        public string Password { get; set; }

        public bool IsDeleted { get; set; }

        #region navigation properties
        [ForeignKey("CompanyId")]
		public Company? Company { get; set; }
		#endregion
	}
}
