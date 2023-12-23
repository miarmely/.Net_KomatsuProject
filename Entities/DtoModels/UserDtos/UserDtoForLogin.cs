using Entities.Attributes;

namespace Entities.DtoModels.UserDtos
{
	public record UserDtoForLogin
	{
		[MiarLength(10, 10, "Telefon", "Phone")]
		[MiarPhone]
		public string TelNo { get; init; }

		[MiarLength(6, 16, "Şifre", "Password")]
		public string Password { get; init; }
	}
}
