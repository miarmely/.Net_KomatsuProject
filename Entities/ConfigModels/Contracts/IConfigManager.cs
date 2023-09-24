namespace Entities.ConfigModels.Contracts
{
	public interface IConfigManager
	{
		UserSettingsConfig UserSettings { get; }
		JwtSettingsConfig JwtSettings { get; }
		MailSettingsConfig MailSettings { get; }
		FileServiceSettingsConfig FileServiceSettings { get; }
		CategoryNamesConfig CategoryNames { get; }
		DbSettingsConfig DbSettings { get; }
	}
}
