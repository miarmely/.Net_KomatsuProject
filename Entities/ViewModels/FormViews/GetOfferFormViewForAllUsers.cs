namespace Entities.ViewModels.FormViews
{
	public record UnansweredGetOfferFormViewForAllUsers 
		: UnansweredGetOfferFormViewForOneUser
	{
        public Guid UserId { get; init; }
    }

	public record AnsweredGetOfferFormViewForAllUsers
		: AnsweredGetOfferFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}

	public record AllGetOfferFormViewForAllUsers
		: AnsweredGetOfferFormViewForOneUser
	{
        public Guid UserId { get; init; }
	}
}