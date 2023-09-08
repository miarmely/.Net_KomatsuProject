namespace Entities.QueryModels
{
	public class PagingParameters
	{
		private const int MaxPageSize = 50;

		private int _pageSize = 10;
		public int PageNumber { get; set; } = 1;
		public int PageSize
		{
			get
			{
				return _pageSize;
			}
			set
			{
				// control maxPageSize
				_pageSize = (value > 50) ? MaxPageSize : value;
			}
		}
	}
}
