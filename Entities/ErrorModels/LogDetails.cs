namespace Entities.ErrorModels
{
	public record LogDetails
	{
		public string Controller { get; set; }
		public string Action{ get; set; }
		public string ErrorCode { get; set; }
		public DateTime CreatedAt { get; }

		public LogDetails() =>
			CreatedAt = DateTime.UtcNow;
    }
}
