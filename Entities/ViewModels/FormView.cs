namespace Entities.ViewModels
{
	public record FormViewForOneUser
	{
		public IEnumerable<GeneralCommFormViewForOneUser> GeneralCommForms { get; init; }
		public IEnumerable<GetOfferFormViewForOneUser> GetOfferForms { get; init; }
		public IEnumerable<RentingFormFormViewForOneUser> RentingForms { get; init; }
	}

	public record GeneralCommFormViewForOneUser
	{
		public string FirstName { get; init; }
		public string LastName { get; init; }
		public string Company { get; init; }
		public string Phone { get; init; }
		public string Email { get; init; }
		public string CityName { get; init; }
		public string County { get; init; }
		public string Subject { get; init; }
		public string Message { get; init; }
		public DateTime CreatedAt { get; init; }
	}

	public record GeneralCommFormViewForAllUsers : GeneralCommFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}

	public record GetOfferFormViewForOneUser
	{
		public string FirstName { get; init; }
		public string LastName { get; init; }
		public string Company { get; init; }
		public string Phone { get; init; }
		public string Email { get; init; }
		public string CityName { get; init; }
		public string County { get; init; }
		public string Message { get; init; }
		public string MainCategoryName { get; init; }
		public string SubCategoryName { get; init; }
		public string Model { get; init; }
		public string BrandName { get; init; }
		public string ImageName { get; init; }
		public DateTime CreatedAt { get; init; }
	}

	public record GetOfferFormViewForAllUsers : RentingFormFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}

	public record RentingFormFormViewForOneUser
	{
		public string FirstName { get; init; }
		public string LastName { get; init; }
		public string Company { get; init; }
		public string Phone { get; init; }
		public string Email { get; init; }
		public string CityName { get; init; }
		public string County { get; init; }
		public string Message { get; init; }
		public string MainCategoryName { get; init; }
		public string SubCategoryName { get; init; }
		public string Model { get; init; }
		public string BrandName { get; init; }
		public string ImageName { get; init; }
		public DateTime CreatedAt { get; init; }
	}

	public record RentingFormFormViewForAllUsers : RentingFormFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}
}