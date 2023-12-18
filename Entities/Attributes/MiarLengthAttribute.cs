using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.Attributes
{
	public class MiarLengthAttribute : ValidationAttribute
	{
		private readonly int _minLength;
		private readonly int _maxLength;
		private readonly string _displayNameInTR;
		private readonly string _displayNameInEN;

		public MiarLengthAttribute(
			int minLength = -1,
			int maxLength = -1,
			string displayNameInTR = null,
			string displayNameInEN = null)
		{
			_minLength = minLength;
			_maxLength = maxLength;
			_displayNameInTR = displayNameInTR;
			_displayNameInEN = displayNameInEN;
		}

		protected override ValidationResult? IsValid(
			object? value,
			ValidationContext validationContext)
		{
			#region when value null (don't look)
			if (value == null)
				return null;
			#endregion

			#region when value length not equal to fixed length (throw)
			var valueInString = value.ToString();

			if (_minLength == _maxLength
				&& valueInString.Length != _minLength)
					throw new ErrorWithCodeException(
						400,
						"FE-NV-L",
						"Format Error - Not Valid - Length",
						JsonSerializer.Serialize(new
						{
							TR = $"'{_displayNameInTR}', '{_minLength}' karakter uzunluğunda olmalı",
							EN = $"chars length of '{_displayNameInEN}' must be '{_minLength}'"
						}));
			#endregion

			#region when value smaller than min length (throw)
			if (_minLength != -1 // when min length control wanting
				&& valueInString.Length < _minLength)
				throw new ErrorWithCodeException(
					400,
					"FE-MinL",
					"Format Error - Minimum Length",
					JsonSerializer.Serialize(new
					{
						TR = $"'{_displayNameInTR}', en az `{_minLength}` karakterden oluşmalı",
						EN = $"chars length of '{_displayNameInEN}' must be min `{_minLength}`"
					}));
				// i will choose error message by language in global exception handler
				// because i can't reach language parameters from here
			#endregion

			#region when max length exceeded (throw)
			else if (_maxLength != -1  // when max length control wanting
				&& valueInString.Length > _maxLength)
				throw new ErrorWithCodeException(
					400,
					"FE-MaxL",
					"Format Error - Maximum Length",
					JsonSerializer.Serialize(new
					{
						TR = $"'{_displayNameInTR}', en fazla `{_minLength}` karakterden oluşmalı",
						EN = $"chars length of '{_displayNameInEN}' must be max `{_minLength}`"
					}));
			#endregion

			return null;
		}
	}
}
