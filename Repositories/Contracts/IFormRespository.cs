using Dapper;
using Entities.DtoModels;
using Entities.ViewModels.FormViews;

namespace Repositories.Contracts
{
	public interface IFormRepository : IRepositoryBase
	{
		Task CreateGeneralCommFormAsync(
			DynamicParameters parameters);

		Task<ErrorDto?> CreateGetOfferFormAsync(
			DynamicParameters parameters);

		Task<ErrorDto?> CreateRentingFormAsync(
			DynamicParameters parameters);

		Task<TResult> GetAllFormsOfOneUserAsync<TResult>(
			string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync);

		Task<IEnumerable<T>> GetGeneralCommFormsOfOneUserAsync<T>(
			DynamicParameters parameters);

		Task<IEnumerable<T>> GetGetOfferFormsOfOneUserAsync<T>(
			DynamicParameters parameters);

		Task<IEnumerable<T>> GetRentingFormsOfOneUserAsync<T>(
			DynamicParameters parameters);

		Task<IEnumerable<T>> GetAllGeneralCommFormsAsync<T>(
			DynamicParameters parameters);

		Task<IEnumerable<T>> GetAllGetOfferFormsAsync<T>(
			DynamicParameters parameters);

		Task<IEnumerable<T>> GetAllRentingFormsAsync<T>(
			DynamicParameters parameters);

		Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
			DynamicParameters parameters);
    }
}
