using Entities.ConfigModels.Contracts;
using Microsoft.Extensions.Options;

namespace Entities.ConfigModels
{
	public class ConfigManager : IConfigManager
	{
		private readonly Lazy<UserSettingsConfig> _userSettings;
		private readonly Lazy<JwtSettingsConfig> _jwtSettings;
		private readonly Lazy<MailSettingsConfig> _mailSettings;
		private readonly Lazy<FileServiceSettingsConfig> _fileServiceSettings;
		private readonly Lazy<CategoryNamesConfig> _subCategoryNames;
		private readonly Lazy<DbSettingsConfig> _dbSettings;

		public UserSettingsConfig UserSettings => _userSettings.Value;
		public JwtSettingsConfig JwtSettings => _jwtSettings.Value;
		public MailSettingsConfig MailSettings => _mailSettings.Value;
		public FileServiceSettingsConfig FileServiceSettings => _fileServiceSettings.Value;
		public CategoryNamesConfig CategoryNames => _subCategoryNames.Value;
		public DbSettingsConfig DbSettings => _dbSettings.Value;

        public ConfigManager(IOptions<UserSettingsConfig> userSettings,
			IOptions<JwtSettingsConfig> jwtSettings,
			IOptions<MailSettingsConfig> mailSettings,
			IOptions<FileServiceSettingsConfig> fileServiceSettings,
			IOptions<CategoryNamesConfig> subCategoryNames,
			IOptions<DbSettingsConfig> dbSettings)
        {
			_userSettings = new Lazy<UserSettingsConfig>(() => userSettings.Value);
			_jwtSettings = new Lazy<JwtSettingsConfig>(() => jwtSettings.Value);
			_mailSettings = new Lazy<MailSettingsConfig>(() => mailSettings.Value);
			_fileServiceSettings = new Lazy<FileServiceSettingsConfig>(() =>
				fileServiceSettings.Value);
			_subCategoryNames = new Lazy<CategoryNamesConfig>(() =>
				subCategoryNames.Value);
			_dbSettings = new Lazy<DbSettingsConfig>(() =>
				dbSettings.Value);
		}

	}
}
