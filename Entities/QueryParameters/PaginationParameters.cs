namespace Entities.QueryParameters
{
    public class PaginationParams
    {
        public int PageNumber { get; set; } = 1;
		public int PageSize
		{
			get
			{
				return _pageSize;
			}
			set
			{
				_pageSize = value > 50 ?
					MaxPageSize
					: value;
			}
		}


		#region private
		private const int MaxPageSize = 50;
        private int _pageSize = 10;
        #endregion
    }
}
