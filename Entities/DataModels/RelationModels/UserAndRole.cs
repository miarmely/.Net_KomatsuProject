using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.DataModels.RelationModels
{
    public class UserAndRole
    {
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public Guid UserId { get; set; }

        [Column(TypeName = "tinyint")]
        public int RoleId { get; set; }


        #region navigation properties
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }
        #endregion
    }
}
