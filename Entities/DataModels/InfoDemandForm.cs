using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class InfoDemandForm
	{
		[Key]
        public int Id { get; set; }

        [Column(TypeName = "varchar(50)")]
		public string FullName { get; set; }
		
		[Column(TypeName = "smallint")]
		public int CompanyId { get; set; }

		[Column(TypeName = "char(10)")]
		public string TelNo { get; set; }

		[Column(TypeName = "smallint")]
		public int CityId { get; set; }
		
		[Column(TypeName = "tinyint")]
        public int TopicId { get; set; }

		[Column(TypeName = "varchar(200)")]
        public string? Note { get; set; }
    }
}
