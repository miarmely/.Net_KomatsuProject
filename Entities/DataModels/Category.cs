using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels
{
    public class Category
    {
        [Key]
        [Column(TypeName = "tinyint")]
        public int Id { get; set; }

        [Column(TypeName = "tinyint")]
        public int MainCategoryId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string SubCategoryName{ get; set; }

        #region navigation properties
        [ForeignKey("MainCategoryId")]
        public MainCategory? MainCategory { get; set; }
        #endregion
    }
}
