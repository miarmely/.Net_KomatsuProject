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
		string Machine_DisplayOneById,
		string Machine_Update,
		string Machine_Delete,
		string Machine_GetMainCategoryNames,
		string Machine_GetSubCategoryNames,
		string Machine_GetAllHandStatus,
		string Machine_SeparateTheValuesNotExistsOnTable,
		string Machine_Category_AddMainAndSubCategories,
		string Slider_Create,
		string Slider_DisplayAll,
		string Slider_DisplaySliderPathBySliderNo,
		string Slider_DeleteOneBySliderNo,
		string Slider_DeleteMultipleByFileNames,
		string User_Form_GeneralCommunication_Create,
		string User_Form_GeneralCommunication_GetAll,
		string User_Form_GeneralCommunication_GetAllOfOneUserByUserId,
		string User_Form_GetOffer_Create,
		string User_Form_GetOffer_GetAll,
		string User_Form_GetOffer_GetAllOfOneUserByUserId,
		string User_Form_Renting_Create,
		string User_Form_Renting_GetAll,
		string User_Form_Renting_GetAllOfOneUserByUserId,
		string User_Form_AnswerTheAnyForm);

    public record TableNames(
		string Language,
		string Sliders);
}
