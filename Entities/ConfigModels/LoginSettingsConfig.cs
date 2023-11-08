namespace Entities.ConfigModels
{
    public record LoginSettingsConfig
    {
        public IEnumerable<string> RolesCanBeLoginInTR { get; init; }
        public IEnumerable<string> RolesCanBeLoginInEN { get; init; }
    }
}
