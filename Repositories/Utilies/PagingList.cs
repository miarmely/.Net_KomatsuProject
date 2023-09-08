using Microsoft.EntityFrameworkCore;

namespace Repositories.Utilies
{
	public class PagingList<T> : List<T>
	{
		public int TotalPage { get; private set; }
		public int TotalCount { get; private set; }
		public int CurrentPage { get; private set; }
		public int PageSize { get; private set; }
		public bool HasPrevious => CurrentPage > 1;
		public bool HasNext => CurrentPage < 50;

		public PagingList(List<T> entity, int totalCount, int pageNumber, int pageSize)
		{
			#region initialize properties
			TotalPage = (int)Math.Ceiling(TotalCount / (double)PageSize);
			TotalCount = totalCount;
			CurrentPage = pageNumber;
			PageSize = pageSize;
			#endregion

			// add source to list
			base.AddRange(entity);
		}

		public static async Task<PagingList<T>> ToPagingList(IQueryable<T> source, int pageNumber, int pageSize)
		{
			#region get data for pageNumber
			var entity = await source
				.Skip((pageNumber - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();
			#endregion

			return new PagingList<T>(entity, source.Count(), pageNumber, pageSize);
		}
	}
}
