using Entities.DtoModels;

namespace Entities.ConfigModels
{
    public partial record ErrorDetailsConfig
	{
		public ErrorDetails ISE { get; init; }
		public ErrorDetails NF_S_FP { get; init; }
    }

    public partial record ErrorDetailsConfig  // functions
    {
		public ErrorDto ConvertToErrorDto(
			string language,
			ErrorDetails errorDetails)
		{
			#region set error message by language
			var errorMessage = language switch
			{
				"TR" => errorDetails.ErrorMessage.TR,
				"EN" => errorDetails.ErrorMessage.EN
			};
			#endregion

			return new ErrorDto()
			{
				StatusCode = errorDetails.StatusCode,
				ErrorCode = errorDetails.ErrorCode,
				ErrorDescription = errorDetails.ErrorDescription,
				ErrorMessage = errorMessage
			};
		}

	}

	public record ErrorDetails
    {
        public int StatusCode { get; init; }
        public string ErrorCode { get; init; }
        public string ErrorDescription { get; init; }
        public Languages ErrorMessage { get; init; }
    }

    public record Languages(
        string TR, 
        string EN);
}
