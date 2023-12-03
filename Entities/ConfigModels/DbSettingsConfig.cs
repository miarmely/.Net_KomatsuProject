namespace Entities.ConfigModels
{
    public record DbSettingsConfig
    {
        public ProcedureNames ProcedureNames { get; init; }
        public TableNames TableNames { get; init; }
    }

    public record ProcedureNames(
		string User_Login,
		string User_Create,
		string User_DisplayAll,
		string User_DisplayByTelNo,
		string User_DisplayAllRoles,
		string User_Update,
		string User_Delete,
		string Machine_Create,
		string Machine_DisplayAll,
		string Machine_DisplayByCondition,
		string Machine_Update,
		string Machine_Delete,
		string Machine_GetMainCategoryNames,
		string Machine_GetSubCategoryNames,
		string Machine_GetAllHandStatus,
		string Slider_Create,
		string Slider_DisplayAll,
		string Slider_DisplaySliderPathBySliderNo,
		string Slider_DeleteOneBySliderNo,
		string Slider_DeleteMultipleByFileNames);

    public record TableNames(
		string Language,
		string Sliders);
}
