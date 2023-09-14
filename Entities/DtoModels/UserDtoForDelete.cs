namespace Entities.DtoModels
{
	public record UserDtoForDelete
	{
        public IEnumerable<string> TelNos { get; set; }
    }
}
