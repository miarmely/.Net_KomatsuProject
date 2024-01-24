using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class FormRepository : RepositoryBase, IFormRepository
	{
		public FormRepository(
			RepositoryContext context,
			IConfigManager configs) : base(context, configs)
		{ }

		public async Task CreateGeneralCommFormAsync(
			DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<int>(
				base.Configs.DbSettings.ProcedureNames
					.User_Form_GeneralCommunication_Create,
				parameters);

		public async Task<ErrorDto?> CreateGetOfferFormAsync(
			DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<ErrorDto>(
				base.Configs.DbSettings.ProcedureNames.User_Form_GetOffer_Create,
				parameters);

		public async Task<ErrorDto?> CreateRentingFormAsync(
			DynamicParameters parameters) =>
			await base.QuerySingleOrDefaultAsync<ErrorDto>(
				base.Configs.DbSettings.ProcedureNames.User_Form_Renting_Create,
				parameters);

		public async Task<TResult> GetAllFormsOfOneUserAsync<TResult>(
			string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync) =>
				await base.MultipleQueryAsync(
					sqlCommand,
					parameters,
					funcAsync);

		public async Task<IEnumerable<T>> GetGeneralCommFormsOfOneUserAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_GeneralCommunication_GetAllOfOneUserByUserId,
					parameters);

		public async Task<IEnumerable<T>> GetGetOfferFormsOfOneUserAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_GetOffer_GetAllOfOneUserByUserId,
					parameters);

		public async Task<IEnumerable<T>> GetRentingFormsOfOneUserAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_Renting_GetAllOfOneUserByUserId,
					parameters);

		public async Task<IEnumerable<T>> GetAllGeneralCommFormsAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_GeneralCommunication_GetAll,
					parameters);

		public async Task<IEnumerable<T>> GetAllGetOfferFormsAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_GetOffer_GetAll,
					parameters);

		public async Task<IEnumerable<T>> GetAllRentingFormsAsync<T>(
			DynamicParameters parameters) =>
				await base.QueryAsync<T>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_Renting_GetAll,
					parameters);

		public async Task<ErrorDto?> AnswerTheFormAsync(
			DynamicParameters parameters) =>
				await base.QuerySingleOrDefaultAsync<ErrorDto>(
					base.Configs.DbSettings.ProcedureNames
						.User_Form_AnswerTheAnyForm,
					parameters);
	}
}
