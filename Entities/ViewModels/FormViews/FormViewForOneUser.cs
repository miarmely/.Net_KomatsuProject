using Entities.ViewModels.FormViews;

namespace Entities.ViewModels
{
	public record AnsweredFormViewForOneUser
	{
		public IEnumerable<AnsweredGeneralCommFormViewForOneUser> GeneralCommForms
		{ get; init; }
		public IEnumerable<AnsweredGetOfferFormViewForOneUser> GetOfferForms
		{ get; init; }
		public IEnumerable<AnsweredRentingFormViewForOneUser> RentingForms
		{ get; init; }
	}

	public record UnansweredFormViewForOneUser
	{
		public IEnumerable<AnsweredGeneralCommFormViewForOneUser> GeneralCommForms
		{ get; init; }
		public IEnumerable<UnansweredGetOfferFormViewForOneUser> GetOfferForms
		{ get; init; }
		public IEnumerable<AnsweredRentingFormViewForOneUser> RentingForms
		{ get; init; }
	}

	public record AllFormViewForOneUser
	{
		public IEnumerable<AllGeneralCommFormViewForOneUser> GeneralCommForms
		{ get; init; }
		public IEnumerable<AllGetOfferFormViewForOneUser> GetOfferForms 
		{ get; init; }
		public IEnumerable<AllRentingFormViewForOneUser> RentingForms 
		{ get; init; }
	}
}