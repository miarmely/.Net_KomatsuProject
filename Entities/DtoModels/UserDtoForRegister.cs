using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels
{
	public record UserDtoForRegister
	{
		[Required]
		[MaxLength(50, ErrorMessage = "FE-F")]
		public string FirstName { get; init; }

		[Required]
		[MaxLength(50, ErrorMessage = "FE-L")]
		public string LastName { get; init; }

		[Required]
		[MaxLength(50, ErrorMessage = "FE-C")]
		public string CompanyName { get; init; }

		[Required]
		[MaxLength(10, ErrorMessage = "FE-T")]
		public string TelNo { get; init; }

		[Required]
		[MaxLength(50, ErrorMessage = "FE-E")]
		public string Email { get; init; }

		[Required]
		[StringLength(maximumLength:16, MinimumLength = 6, ErrorMessage = "FE-P")]
		public string Password { get; init; }
	}
}
