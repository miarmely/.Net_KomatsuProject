namespace Entities.DtoModels
{
	public record UserDtoForLogin
	{
		public string TelNo { get; init; }
		public string Password { get; init; }
	}
}
