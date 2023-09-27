using System.Collections.ObjectModel;

namespace Entities.ViewModels
{
    public record UserView
    {
        public Guid UserId { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string CompanyName { get; init; }
        public string TelNo { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
        public ICollection<string> RoleNames { get; } 
        public DateTime CreatedAt { get; init; }
        public string Language { get; init; }

        public UserView() => 
            RoleNames = new Collection<string>();
    }

    public record RolePartForUserView
    {
        public string Id { get; init; }
        public string RoleName { get; init; }
    }
}
