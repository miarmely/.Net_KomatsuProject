namespace Entities.ConfigModels
{
    public record LoginSettingsConfig
    {
        public IEnumerable<string> RolesCanBeLoginToAdminPanel { get; init; }
    }
}
