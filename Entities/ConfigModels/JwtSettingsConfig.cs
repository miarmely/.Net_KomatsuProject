namespace Entities.ConfigModels
{
	public record JwtSettingsConfig
	{
        public string ValidIssuer { get; init; }
        public string ValidAudience { get; init; }
        public string SecretKey { get; init; }
        public int Expires { get; init; }
    }
}
