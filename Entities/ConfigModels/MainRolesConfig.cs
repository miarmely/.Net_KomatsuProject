namespace Entities.ConfigModels
{
    public record MainRolesConfig
    {
        public string Admin { get; init; }
        public string Editor { get; init; }
        public string User { get; init; }
    }
}
