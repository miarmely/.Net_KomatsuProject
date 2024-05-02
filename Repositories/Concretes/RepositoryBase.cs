using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Contracts;
using System.Data;


namespace Repositories.Concretes
{
	public abstract partial class RepositoryBase  // private
		: IRepositoryBase
	{
		private RepositoryContext _context;
		private readonly IConfigManager _configs;

		public IConfigManager Configs => _configs;

		public RepositoryBase(RepositoryContext context, IConfigManager configs)
		{
			_context = context;
			_configs = configs;
		}

		private CommandDefinition GetCommandDefinitionForProcedures(
			string commandText,
			DynamicParameters? parameters,
			IDbTransaction? transaction = null) =>
				new CommandDefinition(
					commandText,
					parameters,
					transaction,
					commandType: CommandType.StoredProcedure);
	}

	public abstract partial class RepositoryBase  // public
	{
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
			DynamicParameters? parameters,
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
			DynamicParameters? parameters)
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
			DynamicParameters? parameters,
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

		public async Task<ErrorDtoWithMessage> ExecuteAsync(
			string procedureName,
			DynamicParameters parameters)
		{
			#region update parameters
			parameters.Add("StatusCode", 0, DbType.Int16, ParameterDirection.Output);
			parameters.Add("ErrorCode", "", DbType.String, ParameterDirection.Output);
			parameters.Add("ErrorMessage", "", DbType.String, ParameterDirection.Output);

			parameters.Add("ErrorDescription",
				"",
				DbType.String,
				ParameterDirection.Output);
			#endregion

			#region execute command without returning data
			using (var connection = _context.CreateSqlConnection())
			{
				await connection.ExecuteAsync(
					GetCommandDefinitionForProcedures(procedureName, parameters));
			}
			#endregion

			return new ErrorDtoWithMessage
			{
				StatusCode = parameters.Get<Int16>("StatusCode"),
				ErrorCode = parameters.Get<string>("ErrorCode"),
				ErrorDescription = parameters.Get<string>("ErrorDescription"),
				ErrorMessage = parameters.Get<string>("ErrorMessage")
			};
		}

		public async Task ExecuteWithTransactionAsync(
			string procedureName,
			DynamicParameters parameters,
			Func<IDbTransaction, Task> funcInTransactionAsync)
		{
			#region update parameters
			parameters.Add("StatusCode", 0, DbType.Int16, ParameterDirection.Output);
			parameters.Add("ErrorCode", "", DbType.String, ParameterDirection.Output);
			parameters.Add("ErrorMessage", "", DbType.String, ParameterDirection.Output);

			parameters.Add("ErrorDescription",
				"",
				DbType.String,
				ParameterDirection.Output);
			#endregion

			#region execute procedure with transaction
			using (var connection = _context.CreateSqlConnection())
			{
				connection.Open();

				using (var transaction = connection.BeginTransaction())
				{
					await connection.ExecuteAsync(GetCommandDefinitionForProcedures(
						procedureName,
						parameters,
						transaction));

					await funcInTransactionAsync(transaction);
				}
			}
			#endregion
		}
	}
}