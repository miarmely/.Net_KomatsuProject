using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels
{
	public record UserDtoForRegister
	{
		public string FirstName { get; init; }
		public string LastName { get; init; }
		public string CompanyName { get; init; }
		public string TelNo { get; init; }
		public string Email { get; init; }
		public string Password { get; init; }
	}
}
