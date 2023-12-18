namespace Entities.ViewModels
{
	public record FormViewForOneUser
	{
		public IEnumerable<GeneralCommFormViewForDisplayOneUser> GeneralCommForms { get; init; }
		public IEnumerable<GetOfferFormViewForDisplayOneUser> GetOfferForms { get; init; }
		public IEnumerable<RentingFormFormViewForDisplayOneUser> RentingForms { get; init; }
	}

	public record GeneralCommFormViewForDisplayOneUser
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

	public record GeneralCommFormViewForDisplayAll : GeneralCommFormViewForDisplayOneUser
	{
		public Guid UserId { get; init; }
	}

	public record GetOfferFormViewForDisplayOneUser
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

	public record GetOfferFormViewForDisplayAll : GetOfferFormViewForDisplayOneUser
	{
		public Guid UserId { get; init; }
	}

	public record RentingFormFormViewForDisplayOneUser
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

	public record RentingFormFormViewForDisplayAll : RentingFormFormViewForDisplayOneUser
	{
		public Guid UserId { get; init; }
	}
}