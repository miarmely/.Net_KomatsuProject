using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repositories.Contracts;
using Repositories.EF;
using System.Linq.Expressions;

namespace Repositories.Concretes
{
	public class RepositoryBase<T> : IRepositoryBase<T> where T : class
	{
		private readonly RepositoryContext _context;

		public RepositoryBase(RepositoryContext context) =>
			_context = context;

		public void Create(T entity) =>
			_context.Set<T>()
				.Add(entity);

		public IQueryable<T> FindAll(bool trackChanges) =>
			trackChanges ?
				_context.Set<T>()
				: _context.Set<T>().AsNoTracking();

		public IQueryable<T> FindWithCondition(Expression<Func<T, bool>> expression,
			bool trackChanges) =>
			trackChanges ?
				_context.Set<T>().Where(expression)
				: _context.Set<T>().Where(expression).AsNoTracking();

		public void Update(T entity) =>
			_context.Set<T>()
				.Update(entity);

		public void Delete(T entity) =>
			_context.Set<T>()
				.Remove(entity);

		public async Task<List<T>> ControlOrderByAsync<TResult>(
			IQueryable<T> entity,
			Expression<Func<T, TResult>> orderBy,
			bool asAscending) =>
				asAscending ?
					await entity   // ascending
						.OrderBy(orderBy)
						.ToListAsync()
					: await entity   // descending
						.OrderByDescending(orderBy)
						.ToListAsync();
	}
}
