
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IRepositoryBase<T>
	{
        RepositoryContext _context { get; }
        Task<int> Count(string tableName);
    }
}
