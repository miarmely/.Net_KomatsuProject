using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class FormRepository :  RepositoryBase, IFormRepository
	{
        public FormRepository(
			RepositoryContext context,
			IConfigManager configs) : base(context, configs)
        {}

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

		public async Task<TResult> GetAllFormsOfUserAsync<TResult>(
			string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync) =>
				await base.MultipleQueryAsync(
					sqlCommand,
					parameters,
					funcAsync);
	}
}
