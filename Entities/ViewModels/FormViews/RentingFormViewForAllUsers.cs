namespace Entities.ViewModels.FormViews
{
    public record FormViewForWaitingRentingFormsOfAllUsers
        : FormViewForWaitingRentingFormOfUser
    {
        public Guid UserId { get; init; }
    }

    public record FormViewForAcceptedRentingFormsOfAllUsers
        : FormViewForAcceptedRentingFormOfUser
    {
        public Guid UserId { get; init; }
    }

    public record FormViewForRejectedRentingFormsOfAllUsers
        : FormViewForAcceptedRentingFormsOfAllUsers
    { }
}