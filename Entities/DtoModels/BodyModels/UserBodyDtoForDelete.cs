namespace Entities.DtoModels.BodyModels
{
    public record UserBodyDtoForDelete
    {
        public IEnumerable<string> TelNos { get; set; }
    }
}
