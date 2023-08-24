namespace Entities.ConfigModels
{
	public class UserSettingsConfig
	{
        public int FirstNameMaxLength { get; set; }
		public int LastNameMaxLength { get; set; }
		public int CompanyNameMaxLength { get; set; }
		public int TelNoLength { get; set; }
		public int EmailMaxLengthWithoutExtension { get; set; }
		public int PasswordMinLength { get; set; }
		public int PasswordMaxLength { get; set; }
	}
}
