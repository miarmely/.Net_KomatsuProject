namespace Entities.ViewModels
{
    public record UserAndRoleView
    {
        public Guid UserId { get; init; }
        public string RoleName { get; init; }
    }
}
