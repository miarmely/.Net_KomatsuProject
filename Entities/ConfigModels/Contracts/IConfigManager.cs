namespace Entities.ConfigModels.Contracts
{
	public interface IConfigManager
	{
		UserSettingsConfig UserSettings { get; }
		JwtSettingsConfig JwtSettings { get; }
		MailSettingsConfig MailSettings { get; }
		DbSettingsConfig DbSettings { get; }
		LoginSettingsConfig LoginSettings { get; }
		ErrorDetailsConfig ErrorDetails { get; }
	}
}
