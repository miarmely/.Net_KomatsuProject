namespace Entities.QueryParameters
{
    public class PaginationParameters
    {
        public int PageNumber { get; set; } = 1;

        #region pageSize
        private const int MaxPageSize = 50;

        private int _pageSize = 10;
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
        #endregion
    }
}
