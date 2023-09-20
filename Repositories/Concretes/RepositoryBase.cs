using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Repositories.Contracts;
using Repositories.EF;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        public readonly RepositoryContext _context;
        public int Count => _context.Set<T>().Count();

        public RepositoryBase(RepositoryContext context) =>
            _context = context;

        public void Create(T entity)
            =>
                _context
                    .Set<T>()
                    .Add(entity);

        public IQueryable<TDbSet> DisplayAll<TDbSet>() 
            where TDbSet : class =>
                _context
                    .Set<TDbSet>()
                    .AsNoTracking();

        public IQueryable<TDbSet> DisplayByCondition<TDbSet>(
            Expression<Func<TDbSet, bool>> condition)
            where TDbSet : class =>
                _context
                    .Set<TDbSet>()
                    .AsNoTracking()
                    .Where(condition);

        public void Update(T entity) =>
            _context.Set<T>()
                .Update(entity);

        public void Delete(T entity) =>
            _context.Set<T>()
                .Remove(entity);

        public async Task<List<TResult>> ExecProcedureAsync<TResult>(FormattableString sqlQuery)
            where TResult : class =>
                await _context
                    .Set<TResult>()
                    .FromSqlInterpolated(sqlQuery)
                    .ToListAsync();
    }
}