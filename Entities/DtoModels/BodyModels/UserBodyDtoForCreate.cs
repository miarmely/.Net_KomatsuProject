namespace Entities.DtoModels.BodyModels
{
    public record UserBodyDtoForCreate
    {
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string CompanyName { get; init; }
        public string TelNo { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
        public string RoleName { get; init; }
    }
}
