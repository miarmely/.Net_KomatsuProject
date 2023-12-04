using System.Text.Json;

namespace Repositories
{
    public partial class PagingList<T> : List<T> where T : class
    {
        public int TotalPage { get; private set; }
        public int TotalCount { get; private set; }
        public int LastPageCount => (int)TotalCount % PageSize == 0 ?
            PageSize  // when lastPage full
            : (int)TotalCount % PageSize;  // when lastPage not full
		public int CurrentPageCount => CurrentPageNo == TotalPage ?
            LastPageCount  // when current page is last page
			: PageSize;  // when not last page
		public int CurrentPageNo { get; private set; }
        public int PageSize { get; private set; }
        public bool HasPrevious => CurrentPageNo > 1;
        public bool HasNext => CurrentPageNo < TotalPage;
    }

	public partial class PagingList<T>  // functions
    {
		public PagingList(IEnumerable<T> entity,
		   int totalCount,
		   int pageNumber,
		   int pageSize)
		{
			#region initialize properties
			TotalCount = totalCount;
			CurrentPageNo = pageNumber;
			PageSize = pageSize;
			TotalPage = (int)Math.Ceiling(totalCount / (double)pageSize);
			#endregion

			// add  to list
			AddRange(entity);
		}

		public async static Task<PagingList<T>> ToPagingListAsync(
			IEnumerable<T> source,
			int totalCount,
			int pageNumber,
			int pageSize) =>
				await Task.Run(() =>
					new PagingList<T>(source, totalCount, pageNumber, pageSize));

		public string GetMetaDataForHeaders() =>
			JsonSerializer.Serialize(new
			{
				TotalPage,
				TotalCount,
				LastPageCount,
				CurrentPageCount,
				CurrentPageNo,
				PageSize,
				HasPrevious,
				HasNext,
			});
	}
}
