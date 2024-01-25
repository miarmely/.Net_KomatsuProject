namespace Entities.ViewModels.FormViews
{
	public record UnansweredGeneralCommFormViewForAllUsers 
		: UnansweredGeneralCommFormViewForOneUser
	{
        public Guid UserId { get; init; }
    }

	public record AnsweredGeneralCommFormViewForAllUsers
		: AnsweredGeneralCommFormViewForOneUser
	{
		public Guid UserId { get; init; }
	}

	public record AllGeneralCommFormViewForAllUsers
		: AllGeneralCommFormViewForOneUser
    {
        public Guid UserId { get; init; }
	}
}