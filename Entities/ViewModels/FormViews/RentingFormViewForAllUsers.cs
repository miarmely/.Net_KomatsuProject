namespace Entities.ViewModels.FormViews
{
	public record UnansweredRentingFormViewForAllUsers 
		: UnansweredRentingFormViewForOneUser
	{
        public Guid UserId { get; init; }
    }

	public record AnsweredRentingFormViewForAllUsers
		: AnsweredRentingFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}

	public record AllRentingFormViewForAllUsers
		: AnsweredRentingFormViewForOneUser
	{
        public Guid UserId { get; init; }
	}
}