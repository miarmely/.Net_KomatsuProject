using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Repositories
{
    public class RepositoryContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public RepositoryContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("SqlServer");
        }

        public IDbConnection CreateSqlConnection() =>
            new SqlConnection(_connectionString);
    }
}
