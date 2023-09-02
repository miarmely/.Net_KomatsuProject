using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
	public class Brand
	{
		[Column(TypeName = "smallint")]
        public int Id { get; set; }

		[Column(TypeName = "varchar(50)")]
		public string Name { get; set; }
	}
}
