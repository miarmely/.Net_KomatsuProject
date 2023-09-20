namespace Entities.ViewModels
{
    public record UserView
    {

        public Guid Id { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string RoleName { get; init; }
        public string TelNo { get; init; }
        public string Email { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
