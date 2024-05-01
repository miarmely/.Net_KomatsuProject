namespace Entities.ConfigModels
{
	public record DbSettingsConfig
	{
		public ProcedureNames ProcedureNames { get; init; }
		public TableNames TableNames { get; init; }
	}

	public record ProcedureNames
	{
		public string U_Login { get; init; }
		public string U_Create { get; init; }
		public string U_DisplayAll { get; init; }
		public string U_DisplayByTelNo { get; init; }
		public string U_DisplayAllRoles { get; init; }
		public string U_Update { get; init; }
		public string U_Delete { get; init; }
		public string M_Create { get; init; }
		public string M_DisplayAll { get; init; }
		public string M_DisplayByCondition { get; init; }
		public string M_DisplayOneById { get; init; }
		public string M_Update { get; init; }
		public string M_Delete { get; init; }
		public string M_GetMainCategoryNames { get; init; }
		public string M_GetSubCategoryNames { get; init; }
		public string M_GetAllHandStatus { get; init; }
		public string M_SeparateTheValuesNotExistsOnTable { get; init; }
		public string Mi_Password_Update { get; init; }
		public string M_C_AddMainAndSubCategories { get; init; }
		public string M_C_AddSubCategories { get; init; }
		public string M_C_DisplayAllMainAndSubcategories { get; init; }
		public string M_C_UpdateMainCategory { get; init; }
		public string M_C_UpdateSubcategories { get; init; }
		public string M_C_UpdateMainAndSubcategories { get; init; }
		public string M_C_DeleteMainCategory { get; init; }
		public string M_C_DeleteSubcategories { get; init; }
		public string S_Create { get; init; }
		public string S_DisplayAll { get; init; }
		public string S_DisplaySliderPathBySliderNo { get; init; }
		public string S_DeleteOneBySliderNo { get; init; }
		public string S_DeleteMultipleByFileNames { get; init; }
		public string U_F_GeneralCommunication_Create { get; init; }
		public string U_F_GeneralCommunication_GetAll { get; init; }
		public string U_F_GeneralCommunication_GetAllOfOneUserByUserId { get; init; }
		public string U_F_GetOffer_Create { get; init; }
		public string U_F_GetOffer_GetAll { get; init; }
		public string U_F_GetOffer_GetAllOfOneUserByUserId { get; init; }
		public string U_F_Renting_Create { get; init; }
		public string U_F_Renting_GetAll { get; init; }
		public string U_F_Renting_GetAllOfOneUserByUserId { get; init; }
		public string U_F_AnswerTheAnyForm { get; init; }
	}

	public record TableNames
	{
        public string Language { get; init; }
        public string Sliders { get; init; }
    }
}