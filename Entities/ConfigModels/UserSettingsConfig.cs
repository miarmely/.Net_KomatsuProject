namespace Entities.ConfigModels
{
	public record UserSettingsConfig
	{
        public FirstNameProp FirstName { get; init; }
		public LastNameProp LastName { get; init; }
		public CompanyNameProp CompanyName { get; init; }
		public TelNoProp TelNo { get; init; }
		public EmailProp Email { get; init; }
		public PasswordProp Password { get; init; }
        public string DefaultRole { get; init; }

        public record FirstNameProp
		{
            public int MaxLength { get; init; }
        }
		public record LastNameProp
		{
			public int MaxLength { get; init; }
		}
		public record CompanyNameProp
		{
			public int MaxLength { get; init; }
		}
		public record TelNoProp
		{
			public int Length { get; init; }
		}
		public record EmailProp
		{
			public int MaxLength { get; init; }
		}
		public record PasswordProp
		{
			public int MinLength { get; init; }
			public int MaxLength { get; init; }
		}
	}
}
