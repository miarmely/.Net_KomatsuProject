using Entities.ErrorModels;
using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels
{
	public record UserDtoForLogin
	{
		[Required]
		[StringLength(maximumLength: 10, MinimumLength = 10, ErrorMessage = "FE-T")]
		public string TelNo { get; init; }

		[Required]
		[StringLength(maximumLength: 16, MinimumLength = 6, ErrorMessage = "FE-P")]
		public string Password { get; init; }
	}
}
