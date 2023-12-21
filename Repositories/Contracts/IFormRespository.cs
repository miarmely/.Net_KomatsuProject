using Dapper;
using Entities.DtoModels;


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

		Task<TResult> GetAllFormsOfUserAsync<TResult>(
			string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync);
	}
}
