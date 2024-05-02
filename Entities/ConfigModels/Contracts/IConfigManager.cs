using Entities.MiarLibrary.ConfigModels;


namespace Entities.ConfigModels.Contracts
{
	public interface IConfigManager
	{
		JwtSettingsConfig JwtSettings { get; }
		MailSettingsConfig MailSettings { get; }
		DbSettingsConfig DbSettings { get; }
		LoginSettingsConfig LoginSettings { get; }
		ErrorDetailsConfig ErrorDetails { get; }
		OTPSettingsConfig OTPSettings { get; }
	}
}