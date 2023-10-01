using Dapper;
using Entities.ConfigModels.Contracts;
using Repositories.Contracts;
using System.Data;


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
            
        public async Task<T> QuerySingleOrDefaultAsync<T>(
            string procedureName, 
            DynamicParameters parameters)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<T>(
                    GetCommandDefinition(procedureName, parameters));
            }
            #endregion
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(
            string procedureName, 
            DynamicParameters parameters)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
                return await connection.QueryAsync<T>(
                    GetCommandDefinition(procedureName, parameters));
            }
            #endregion
        }

        public async Task<IEnumerable<TResult>> QueryAsync<TPart1, TPart2, TResult>(
            string procedureName,
            DynamicParameters parameters,
            Func<TPart1, TPart2, TResult> map,
            string SplitOn)
        {
            #region send query
            using (var connection = _context.CreateSqlConnection())
            {
                return await connection.QueryAsync(
                    GetCommandDefinition(procedureName, parameters), 
                    map, 
                    SplitOn);
            }
            #endregion
        }


        #region private

        private CommandDefinition GetCommandDefinition(
            string commandText, 
            DynamicParameters parameters) =>
                new CommandDefinition(
                    commandText,
                    parameters,
                    commandType: CommandType.StoredProcedure);

        #endregion
    }
}