using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.Attributes
{
	public class MiarLengthAttribute : ValidationAttribute
	{
		private readonly int _minLength;
		private readonly int _maxLength;

		public MiarLengthAttribute(int minLength, int maxLength)
		{
			_minLength = minLength;
			_maxLength = maxLength;
		}

		protected override ValidationResult? IsValid(
			object? value,
			ValidationContext validationContext)
		{
			#region when value null then don't look
			if (value == null)
				return null;
			#endregion

			#region when value smaller than min length (throw)
			var valueInString = value.ToString();

			if (valueInString.Length < _minLength)
				throw new ErrorWithCodeException(
					400,
					"FE-MinL",
					"Formet Error - Minimum Length",
					JsonSerializer.Serialize(new
					{
						PropertyName = validationContext.MemberName,
						MinLength = _minLength
					}));
			#endregion

			#region when max length exceeded (throw)
			else if (valueInString.Length > _maxLength)
				throw new ErrorWithCodeException(
					400,
					"FE-MaxL",
					"Formet Error - Maximum Length",
					JsonSerializer.Serialize(new
					{
						PropertyName = validationContext.MemberName,
						MaxLength = _maxLength
					}));
			#endregion

			return null;
		}
	}
}
