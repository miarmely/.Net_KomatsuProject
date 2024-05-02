using Entities.ConfigModels.Contracts;
using Entities.MiarLibrary.ConfigModels;
using Microsoft.Extensions.Options;


namespace Entities.ConfigModels
{
	public class ConfigManager : IConfigManager
	{
		private readonly Lazy<JwtSettingsConfig> _jwtSettings;
		private readonly Lazy<MailSettingsConfig> _mailSettings;
		private readonly Lazy<DbSettingsConfig> _dbSettings;
		private readonly Lazy<LoginSettingsConfig> _loginSettings;
		private readonly Lazy<ErrorDetailsConfig> _errorDetails;
		private readonly Lazy<OTPSettingsConfig> _OTPSettings;


		public JwtSettingsConfig JwtSettings => _jwtSettings.Value;
		public MailSettingsConfig MailSettings => _mailSettings.Value;
		public DbSettingsConfig DbSettings => _dbSettings.Value;
		public LoginSettingsConfig LoginSettings => _loginSettings.Value;
		public ErrorDetailsConfig ErrorDetails => _errorDetails.Value;
		public OTPSettingsConfig OTPSettings => _OTPSettings.Value;


		public ConfigManager(
			IOptions<JwtSettingsConfig> jwtSettings,
			IOptions<MailSettingsConfig> mailSettings,
			IOptions<DbSettingsConfig> dbSettings,
			IOptions<LoginSettingsConfig> loginSettings,
			IOptions<ErrorDetailsConfig> errorDetails,
			IOptions<OTPSettingsConfig> OTPSettings)
        {
			_jwtSettings = new Lazy<JwtSettingsConfig>(() => jwtSettings.Value);
			_mailSettings = new Lazy<MailSettingsConfig>(() => mailSettings.Value);
            _dbSettings = new Lazy<DbSettingsConfig>(() => dbSettings.Value);
			_loginSettings = new Lazy<LoginSettingsConfig>(() => loginSettings.Value);
			_errorDetails = new Lazy<ErrorDetailsConfig>(() => errorDetails.Value);
			_OTPSettings = new Lazy<OTPSettingsConfig>(() => OTPSettings.Value);
        }

	}
}