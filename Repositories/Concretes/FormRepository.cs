using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.ViewModels.FormViews;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class FormRepository : RepositoryBase, IFormRepository
	{
		public FormRepository(
			RepositoryContext context,
			IConfigManager configs) : base(context, configs)
		{ }

		public async Task<ErrorDtoWithMessage?> CreateGeneralCommFormAsync(
			DynamicParameters parameters) =>
				await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_GeneralCommunication_Create,
					parameters);

		public async Task<ErrorDtoWithMessage?> CreateGetOfferFormAsync(
			DynamicParameters parameters) =>
				await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
					base.Configs.DbSettings.ProcedureNames.U_F_GetOffer_Create,
					parameters);

		public async Task<ErrorDtoWithMessage?> CreateRentingFormAsync(
			DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<ErrorDtoWithMessage>(
				base.Configs.DbSettings.ProcedureNames.U_F_Renting_Create,
				parameters);

        public async Task<IEnumerable<TView>> DisplayAllGeneralCommFormsAsync<TView>(
			DynamicParameters parameters) =>
				await base.QueryAsync<TView>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_GeneralCommunication_GetAll,
					parameters);

        public async Task<IEnumerable<TView>> DisplayAllGetOfferFormsAsync<TView>(
            DynamicParameters parameters) =>
                await base.QueryAsync<TView>(
                    base.Configs.DbSettings.ProcedureNames
                        .U_F_GetOffer_GetAll,
                    parameters);

        public async Task<IEnumerable<TView>> DisplayAllRentingFormsAsync<TView>(
            DynamicParameters parameters) =>
                await base.QueryAsync<TView>(
                    base.Configs.DbSettings.ProcedureNames
                        .U_F_Renting_GetAll,
                    parameters);

        public async Task<IEnumerable<TView>> DisplayGeneralCommFormsOfUserAsync<TView>(
			DynamicParameters parameters) =>
				await base.QueryAsync<TView>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_GeneralCommunication_GetAllOfOneUserByUserId,
					parameters);

		public async Task<IEnumerable<TView>> DisplayGetOfferFormsOfUserAsync<TView>(
			DynamicParameters parameters) =>
				await base.QueryAsync<TView>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_GetOffer_GetAllOfOneUserByUserId,
					parameters);

		public async Task<IEnumerable<TView>> DisplayRentingFormsOfUserAsync<TView>(
			DynamicParameters parameters) =>
				await base.QueryAsync<TView>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_Renting_GetAllOfOneUserByUserId,
					parameters);

		public async Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
			DynamicParameters parameters) =>
				await base.QuerySingleOrDefaultAsync<FormViewForAnswerTheForm>(
					base.Configs.DbSettings.ProcedureNames
						.U_F_AnswerTheAnyForm,
					parameters);
	}
}
