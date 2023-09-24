namespace Entities.ConfigModels
{
    public record DbSettingsConfig
    {
        public ProcedureNames ProcedureNames { get; init; }
    }

    public record ProcedureNames
    {
        public string User_Create { get; init; }
        public string User_DisplayAll { get; init; }
        public string User_Update { get; init; }
        public string User_Delete { get; init; }
    }
}
