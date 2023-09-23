using Entities.Exceptions;

namespace Entities.ViewModels
{
    public record UserView
    {
        public Guid Id { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string CompanyName { get; init; }
        public string TelNo { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
        public ICollection<string> RoleNames { get; init; }
        public DateTime CreatedAt { get; init; }
    }

    public record RolePartForUserView
    {
        public int RoleId { get; init; }
        public string RoleName { get; init; }
    }
}
