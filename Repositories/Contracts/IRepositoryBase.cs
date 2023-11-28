using Dapper;
using Entities.ConfigModels.Contracts;

namespace Repositories.Contracts
{
	public interface IRepositoryBase
	{
        IConfigManager Configs { get; }

        Task<IEnumerable<T>> QueryAsync<T>(
            string procedureName,
            DynamicParameters? parameters);

        Task<T> QuerySingleOrDefaultAsync<T>(
           string procedureName,
           DynamicParameters parameters);

        Task<IEnumerable<TResult>> QueryAsync<TPart1, TPart2, TResult>(
            string procedureName,
            DynamicParameters parameters,
            Func<TPart1, TPart2, TResult> map,
            string SplitOn);

        Task TruncateTableAsync(string tableName);
    }
}
