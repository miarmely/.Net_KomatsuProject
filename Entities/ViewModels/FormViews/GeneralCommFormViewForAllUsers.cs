namespace Entities.ViewModels.FormViews
{
	public record FormViewForAllUnansweredGeneralCommForms
        : FormViewForUnansweredGeneralCommFormsOfUser
    {
        public Guid UserId { get; init; }
    }

	public record FormViewForAllAnsweredGeneralCommForms
        : FormViewForAnsweredGeneralCommFormsOfUser
    {
		public Guid UserId { get; init; }
	}

	public record FormViewForAllGeneralCommForms
        : FormViewForGeneralCommFormsOfUser
    {
        public Guid UserId { get; init; }
	}
}