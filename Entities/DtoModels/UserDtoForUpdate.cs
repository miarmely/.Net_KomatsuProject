namespace Entities.DtoModels
{
    public record UserDtoForUpdate
    {
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public string? CompanyName { get; init; }
        public string? TelNo { get; init; }
        public string? Email { get; init; }
        public ICollection<string>? RoleNames { get; init; }  // can change
    }
}
