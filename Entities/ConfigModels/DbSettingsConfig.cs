namespace Entities.ConfigModels
{
    public record DbSettingsConfig
    {
        public ProcedureNames ProcedureNames { get; init; }
        public TableNames TableNames { get; init; }
    }

    public record ProcedureNames
    {
        public string User_Login { get; init; }
        public string User_Create { get; init; }
        public string User_DisplayAll { get; init; }
        public string User_DisplayByTelNo { get; init; }
        public string User_DisplayAllRoles { get; init; }
        public string User_Update { get; init; }
        public string User_Delete { get; init; }
        public string Machine_Create { get; init; }
        public string Machine_DisplayAll { get; init; }
        public string Machine_DisplayByCondition { get; init; }
        public string Machine_Update { get; init; }
        public string Machine_Delete { get; init; }
        public string Machine_GetMainCategoryNames { get; init; }
        public string Machine_GetSubCategoryNames { get; init; }
        public string Machine_GetAllHandStatus { get; init; }
        public string Slider_Create { get; init; }
        public string Slider_DisplayAll { get; init; }
        public string Slider_DisplaySliderPathBySliderNo { get; init; }
        public string Slider_MultipleDelete { get; init; }
    }
    public record TableNames
    {
        public string Language { get; init; }
        public string Sliders { get; init; }
    }
}
