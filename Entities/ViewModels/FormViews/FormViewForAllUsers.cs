using Entities.ViewModels.FormViews;


namespace Entities.ViewModels
{
	public record AnsweredFormViewForAllUsers
	{
		public IEnumerable<AnsweredGeneralCommFormViewForAllUsers> GeneralCommunicationForms { get; init; }
		public IEnumerable<AnsweredGetOfferFormViewForAllUsers> GetOfferForms
		{ get; init; }
		public IEnumerable<AnsweredRentingFormViewForAllUsers> RentingForms
		{ get; init; }
	}

	public record UnansweredFormViewForAllUsers
	{
		public IEnumerable<AnsweredGeneralCommFormViewForAllUsers> GeneralCommunicationForms { get; init; }
		public IEnumerable<UnansweredGetOfferFormViewForAllUsers> GetOfferForms
		{ get; init; }
		public IEnumerable<AnsweredRentingFormViewForAllUsers> RentingForms
		{ get; init; }
	}

	public record AllFormViewForAllUsers
	{
		public IEnumerable<AllGeneralCommFormViewForAllUsers> GeneralCommunicationForms { get; init; }
		public IEnumerable<AllGetOfferFormViewForAllUsers> GetOfferForms 
		{ get; init; }
		public IEnumerable<AllRentingFormViewForAllUsers> RentingForms 
		{ get; init; }
	}
}