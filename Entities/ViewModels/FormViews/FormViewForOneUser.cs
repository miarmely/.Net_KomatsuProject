using Entities.ViewModels.FormViews;
using Entities.ViewModels.FormViews.Contracts;

namespace Entities.ViewModels
{
	public record AnsweredFormViewForOneUser
	{
		public IEnumerable<AnsweredGeneralCommFormViewForOneUser> GeneralCommunicationForms { get; init; }
		public IEnumerable<AnsweredGetOfferFormViewForOneUser> GetOfferForms
		{ get; init; }
		public IEnumerable<AnsweredRentingFormViewForOneUser> RentingForms
		{ get; init; }
	}

	public record UnansweredFormViewForOneUser
	{
		public IEnumerable<UnansweredGeneralCommFormViewForOneUser> GeneralCommunicationForms { get; init; }
		public IEnumerable<UnansweredGetOfferFormViewForOneUser> GetOfferForms
		{ get; init; }
		public IEnumerable<UnansweredRentingFormViewForOneUser> RentingForms
		{ get; init; }
	}

	public record AllFormViewForOneUser
	{
		public IEnumerable<AllGeneralCommFormViewForOneUser> GeneralCommunicationForms { get; init; }
		public IEnumerable<AllGetOfferFormViewForOneUser> GetOfferForms 
		{ get; init; }
		public IEnumerable<AllRentingFormViewForOneUser> RentingForms 
		{ get; init; }
	}
}