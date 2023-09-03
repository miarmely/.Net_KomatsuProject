using Entities.ConfigModels.Contracts;
using Microsoft.Extensions.Options;

namespace Entities.ConfigModels
{
	public class ConfigManager : IConfigManager
	{
		#region fields
		private readonly Lazy<UserSettingsConfig> _userSettings;
		private readonly Lazy<JwtSettingsConfig> _jwtSettings;
		private readonly Lazy<MailSettingsConfig> _mailSettings;
		#endregion

		#region properties
		public UserSettingsConfig UserSettings => _userSettings.Value;
		public JwtSettingsConfig JwtSettings => _jwtSettings.Value;
		public MailSettingsConfig MailSettings => _mailSettings.Value;
		#endregion

		#region functions
		public ConfigManager(IOptions<UserSettingsConfig> userSettings,
			IOptions<JwtSettingsConfig> jwtSettings,
			IOptions<MailSettingsConfig> mailSettings
			)
        {
			_userSettings = new Lazy<UserSettingsConfig>(() => userSettings.Value);
			_jwtSettings = new Lazy<JwtSettingsConfig>(() => jwtSettings.Value);
			_mailSettings = new Lazy<MailSettingsConfig>(() => mailSettings.Value);
		}
		#endregion
	}
}
