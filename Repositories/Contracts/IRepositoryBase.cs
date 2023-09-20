using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Repositories.Contracts
{
	public interface IRepositoryBase<T>
	{
		int Count { get; }
		void Create(T entity);
        void Update(T entity);
		void Delete(T entity);

        IQueryable<TDbSet> DisplayAll<TDbSet>() 
            where TDbSet : class;

        public IQueryable<TDbSet> DisplayByCondition<TDbSet>(
            Expression<Func<TDbSet, bool>> condition) 
            where TDbSet : class;

        Task<List<TResult>> ExecProcedureAsync<TResult>(FormattableString sqlQuery)
            where TResult : class;
    }
}
