namespace Entities.ViewModels.FormViews
{
	public record FormViewForWaitingGetOfferFormsOfAllUsers
        : FormViewForWaitingGetOfferFormOfUser
    {
        public Guid UserId { get; init; }
    }

	public record FormViewForAcceptedGetOfferFormsOfAllUsers
		: FormViewForAcceptedGetOfferFormOfUser
    {
		public Guid UserId { get; init; }
	}

	public record FormViewForRejectedGetOfferFormsOfAllUsers
        : FormViewForRejectedGetOfferFormOfUser
    {
        public Guid UserId { get; init; }
	}
}