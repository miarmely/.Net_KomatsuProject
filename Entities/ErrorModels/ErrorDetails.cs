using System.Text.Json;

namespace Entities.ErrorModels
{
	public class ErrorDetails
	{
        public int StatusCode { get; set; }
		public string? ErrorCode { get; set; }
		public string? ErrorDescription { get; set; }
		public LogDetails LogDetails { get; set; }

		public override string ToString() =>
			JsonSerializer.Serialize(this);
	}
}
