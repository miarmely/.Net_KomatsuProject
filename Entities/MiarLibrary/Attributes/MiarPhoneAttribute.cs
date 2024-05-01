using Entities.DtoModels;
using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Entities.MiarLibrary.Attributes
{
	public class MiarPhoneAttribute : ValidationAttribute
	{
		private readonly ErrorDtoWithMessage _errorDto = new ErrorDtoWithMessage
		{
			StatusCode = 400,
			ErrorCode = "FE-U-P",
			ErrorDescription = "Format Error - User - Phone",
			ErrorMessage = JsonSerializer.Serialize(new
			{
				TR = "\"Telefon\" geçerli değil",
				EN = "\"Phone\" Invalid"
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
				throw new ExceptionWithMessage(_errorDto);
			#endregion

			#region control right chunk of string (throw)
			var rightChunkOfString = phoneInStr
				.Substring(phoneInStr.Length / 2);

			if (!int.TryParse(rightChunkOfString, out int _))
				throw new ExceptionWithMessage(_errorDto);
			#endregion

			return ValidationResult.Success;
		}
	}
}