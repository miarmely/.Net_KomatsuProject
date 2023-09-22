
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IRepositoryBase<T>
	{
        DapperContext _context { get; }
        Task<int> Count(string tableName);
    }
}
