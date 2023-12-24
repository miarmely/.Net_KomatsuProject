using Entities.ConfigModels.Contracts;
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

		public JwtSettingsConfig JwtSettings => _jwtSettings.Value;
		public MailSettingsConfig MailSettings => _mailSettings.Value;
		public DbSettingsConfig DbSettings => _dbSettings.Value;
		public LoginSettingsConfig LoginSettings => _loginSettings.Value;
		public ErrorDetailsConfig ErrorDetails => _errorDetails.Value;

		
		public ConfigManager(
			IOptions<JwtSettingsConfig> jwtSettings,
			IOptions<MailSettingsConfig> mailSettings,
			IOptions<DbSettingsConfig> dbSettings,
			IOptions<LoginSettingsConfig> loginSettings,
			IOptions<ErrorDetailsConfig> errorDetails)
        {
			_jwtSettings = new Lazy<JwtSettingsConfig>(() => jwtSettings.Value);
			_mailSettings = new Lazy<MailSettingsConfig>(() => mailSettings.Value);
            _dbSettings = new Lazy<DbSettingsConfig>(() => dbSettings.Value);
			_loginSettings = new Lazy<LoginSettingsConfig>(() => loginSettings.Value);
			_errorDetails = new Lazy<ErrorDetailsConfig>(() => errorDetails.Value);
        }

	}
}
