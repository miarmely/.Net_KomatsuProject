namespace Entities.ViewModels
{
	public record FormView
	{
        public GeneralCommunicationForm GeneralCommunicationForm { get; init; }
        public GetOfferForm GetOfferForm { get; init; }
        public RentingFormForm RentingFormForm { get; init; }
    }

	public record GeneralCommunicationForm(
		string FirstName,
		string LastName,
		string Company,
		string Phone,
		string Email,
		string CityName,
		string County,
		string Subject,
		string Message,
		DateTime CreatedAt);

	public record GetOfferForm(
		string FirstName,
		string LastName,
		string Company,
		string Phone,
		string Email,
		string CityName,
		string County,
		string Message,
		DateTime CreatedAt,
		string MainCategoryName,
		string SubCategoryName,
		string Model,
		string BrandName,
		string ImageName);

	public record RentingFormForm(
		string FirstName,
		string LastName,
		string Company,
		string Phone,
		string Email,
		string CityName,
		string County,
		string Message,
		DateTime CreatedAt,
		string MainCategoryName,
		string SubCategoryName,
		string Model,
		string BrandName,
		string ImageName);
}
