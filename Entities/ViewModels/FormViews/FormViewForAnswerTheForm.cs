namespace Entities.ViewModels.FormViews
{
    public record FormViewForAnswerTheForm
    {
        public string AnswererFirstName { get; init; }
        public string AnswererLastName { get; init; }
        public string AnswererEmail { get; init; }
        public DateTime AnsweredDate { get; init; }
    }
}
