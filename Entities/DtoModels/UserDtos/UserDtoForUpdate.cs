using Entities.Attributes;

namespace Entities.DtoModels.UserDtos
{
	public record UserDtoForUpdateForMobile
	{
		[MiarLength(1, 50, "Ad", "Firstname")]
		public string? FirstName { get; init; }

		[MiarLength(1, 50, "Soyad", "Lastname")]
		public string? LastName { get; init; }

		[MiarLength(1, 50, "Şirket Adı", "Company Name")]
		public string? CompanyName { get; init; }

		[MiarLength(10, 10, "Telefon", "Phone")]
		[MiarPhone]
		public string? TelNo { get; init; }

		[MiarLength(1, 50, "Email", "Email")]
		[MiarEmail]
		public string? Email { get; init; }

		[MiarLength(6, 16, "Şifre", "Password")]
		public string? Password { get; init; }
	}

	public record UserDtoForUpdateForPanel : UserDtoForUpdateForMobile
    {
        public string? RoleNames { get; init; }
    }
}
