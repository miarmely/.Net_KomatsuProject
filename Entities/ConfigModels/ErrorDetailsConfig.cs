using Entities.DtoModels;

namespace Entities.ConfigModels
{
    public partial record ErrorDetailsConfig
	{
		public ErrorDetails ISE { get; init; }
		public ErrorDetails NF_F_D { get; init; }
		public ErrorDetails FiE_U_I { get; init; }
		public ErrorDetails FiE_U_P { get; init; }
		public ErrorDetails FiE_U_S { get; init; }
		public ErrorDetails FiE_D_I { get; init; }
		public ErrorDetails FiE_D_P { get; init; }
		public ErrorDetails FiE_D_S { get; init; }
		public ErrorDetails AE_F { get; init; }
		public ErrorDetails FE_U_E { get; init; }
	}

    public partial record ErrorDetailsConfig  // functions
    {
		public static ErrorDto ToErrorDto(
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

    public record Languages
	{
		public string TR { get; init; }
		public string EN { get; init; }
	}
}
