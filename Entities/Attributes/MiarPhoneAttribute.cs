using Entities.DtoModels;
using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.Attributes
{
	public class MiarPhoneAttribute : ValidationAttribute
	{
		private readonly ErrorDto _errorDto;

		public MiarPhoneAttribute() =>
			_errorDto = new ErrorDto()
			{
				StatusCode = 400,
				ErrorCode = "FE-U-Ph",
				ErrorDescription = "Format Error - User - Phone",
				ErrorMessage = JsonSerializer.Serialize(new
				{
					TR = "\"Telefon\", geçerli değil",
					EN = "\"Phone\", not valid"
				})
			};

		protected override ValidationResult? IsValid(
			object? value,
			ValidationContext validationContext)
		{
			#region when value is null (return)
			if (value == null)
				return null;
			#endregion

			#region control left chunk of string (throw)
			var phoneInStr = value as string;

			var leftChunkOfString = phoneInStr
				.Substring(0, phoneInStr.Length / 2);

			if (!int.TryParse(leftChunkOfString, out int _))
				throw new ErrorWithCodeException(_errorDto);

			// i chunked phone as 2 part because i can't parse telephone to int as
			// direct. Digit quantity of max int value is 7 but our phone digit
			// quantity is 11 so i chunked.
			#endregion

			#region control right chunk of string
			var rightChunkOfString = phoneInStr
				.Substring(phoneInStr.Length / 2);

			if (!int.TryParse(rightChunkOfString, out int _))
				throw new ErrorWithCodeException(_errorDto);
			#endregion

			return ValidationResult.Success;
		}
	}
}
