using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;

namespace Repositories.Contracts
{
	public interface IRepositoryBase
	{
        IConfigManager Configs { get; }

		Task<IEnumerable<T>> QueryAsync<T>(string query);

		Task<IEnumerable<T>> QueryAsync<T>(
            string procedureName,
            DynamicParameters? parameters);

        Task<IEnumerable<TResult>> QueryAsync<TPart1, TPart2, TResult>(
            string procedureName,
            DynamicParameters? parameters,
            Func<TPart1, TPart2, TResult> map,
            string SplitOn);

		Task<T> QuerySingleOrDefaultAsync<T>(
		   string procedureName,
		   DynamicParameters? parameters);

		Task<TResult> MultipleQueryAsync<TResult>(
			string sqlCommand,
			DynamicParameters? parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync);

		Task<ErrorDto> ExecuteAsync(string sql, DynamicParameters parameters);
	}
}