namespace Entities.ConfigModels
{
	public record MailSettingsConfig
	{
		public string Host { get; init; }
		public int Port { get; init; }
		public string DisplayName { get; init; }
		public string From { get; init; }
		public string Username { get; init; }
		public string Password { get; init; }
		public bool UseSSL { get; init; }
		public bool UseTLS { get; init; }
	}
}
