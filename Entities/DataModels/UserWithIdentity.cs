using Microsoft.AspNetCore.Identity;

namespace Entities.DataModels
{
	public class UserWithIdentity : IdentityUser
	{
        public string TelNo { get; set; }
		public string Password { get; set; }
	}
}
