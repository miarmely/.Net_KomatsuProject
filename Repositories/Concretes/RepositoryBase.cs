using Dapper;
using Repositories.Contracts;
using System.Data;


namespace Repositories.Concretes
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        public DapperContext _context { get; }

        public RepositoryBase(DapperContext context) =>
            _context = context;

        public async Task<int> Count(string tableName)
        {
            using (var connection = _context.CreateSqlConnection())
            {
                #region set parameters
                var parameters = new DynamicParameters();

                parameters.Add("TableName", tableName, DbType.String);
                #endregion

                #region get total count of table
                var totalCount = await connection
                    .QuerySingleOrDefaultAsync<int>(
                        "SELECT COUNT(*) FROM @TableName",
                        parameters);
                #endregion

                return totalCount;
            }
        }
    }
}