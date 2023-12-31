using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.Exceptions;
using Repositories.Contracts;
using System.Data;
using System.Reflection.Metadata.Ecma335;

namespace Repositories.Concretes
{
    public abstract class RepositoryBase : IRepositoryBase
    {
        private RepositoryContext _context;
        private readonly IConfigManager _configs;

        public IConfigManager Configs => _configs;

        public RepositoryBase(RepositoryContext context, IConfigManager configs)
        {
            _context = context;
            _configs = configs;
        }
            
        public async Task<IEnumerable<T>> QueryAsync<T>(
            string procedureName, 
            DynamicParameters? parameters)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
                return await connection.QueryAsync<T>(
                    GetCommandDefinitionForProcedures(procedureName, parameters));
            }
            #endregion
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(
            string query)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
                return await connection.QueryAsync<T>(query);    
            }
            #endregion
        }

        public async Task<IEnumerable<TResult>> QueryAsync<TPart1, TPart2, TResult>(
            string procedureName,
            DynamicParameters parameters,
            Func<TPart1, TPart2, TResult> map,
            string splitOn)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
				try
				{
					#region get result
					var result = await connection.QueryAsync(
					    GetCommandDefinitionForProcedures(procedureName, parameters),
					    map,
					    splitOn);
					#endregion

					return result;
				}
                catch (Exception ex)
                {
					// i use try catch because if returned table empty then system
					// give error about "splitOn" parameter

					return new List<TResult>();  // send empty list
				}
			}
            #endregion
		}

		public async Task<T> QuerySingleOrDefaultAsync<T>(
			string procedureName,
			DynamicParameters parameters)
		{
			#region send query
			using (var connection = _context.CreateSqlConnection())
			{
				return await connection.QuerySingleOrDefaultAsync<T>(
					GetCommandDefinitionForProcedures(procedureName, parameters));
			}
			#endregion
		}

		public async Task<TResult> MultipleQueryAsync<TResult>(
			string sqlCommand,
			DynamicParameters parameters,
			Func<SqlMapper.GridReader, Task<TResult>> funcAsync)
		{
			#region send multiple query
			using (var connection = _context.CreateSqlConnection())
			{
				using (var multi = await connection
					.QueryMultipleAsync(sqlCommand, parameters))
				{
					return await funcAsync(multi);
				}
			}
			#endregion
		}


		#region private

		private CommandDefinition GetCommandDefinitionForProcedures(
            string commandText, 
            DynamicParameters? parameters) =>
                new CommandDefinition(
                    commandText,
                    parameters,
                    commandType: CommandType.StoredProcedure);

        #endregion
    }
}