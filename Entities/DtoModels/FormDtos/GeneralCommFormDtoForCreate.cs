

using Entities.Attributes;

namespace Entities.DtoModels.FormDtos
{
	public class GeneralCommFormDtoForCreate
	{
		[MiarLength(1, 40, "Ad", "First Name")] public string FirstName { get; init; }
		[MiarLength(1, 40, "Soyad", "Last Name")] public string LastName { get; init; }
		[MiarLength(1, 80, "Şirket", "Company")] public string Company { get; init; }
		[MiarLength(10, 10, "Telefon", "Phone")] public string Phone { get; init; }
		[MiarLength(1, 50, "Email", "Email")] public string Email { get; init; }
		[MiarLength(1, -1, "Şehir", "City")] public string CityName { get; init; }
		[MiarLength(1, 100, "İlçe", "County")] public string County { get; init; }
		[MiarLength(1, 100, "Konu", "Subject")] public string Subject { get; init; }
		[MiarLength(1, 1000, "Mesaj", "Message")] public string Message { get; init; }
		public DateTime CreatedAt { get; init; }
	}

	public class GetOfferFormDtoForCreate
	{
		public Guid MachineId { get; init; }
		[MiarLength(1, 40, "Ad", "First Name")] public string FirstName { get; init; }
		[MiarLength(1, 40, "Soyad", "Last Name")] public string LastName { get; init; }
		[MiarLength(1, 80, "Şirket", "Company")] public string Company { get; init; }
		[MiarLength(10, 10, "Telefon", "Phone")] public string Phone { get; init; }
		[MiarLength(1, 50, "Email", "Email")] public string Email { get; init; }
		[MiarLength(1, -1, "Şehir", "City")] public string CityName { get; init; }
		[MiarLength(1, 100, "İlçe", "County")] public string County { get; init; }
		[MiarLength(1, 1000, "Mesaj", "Message")] public string Message { get; init; }
		public DateTime CreatedAt { get; init; }
	}

	public class RentingFormDtoForCreate : GetOfferFormDtoForCreate
	{}
}
