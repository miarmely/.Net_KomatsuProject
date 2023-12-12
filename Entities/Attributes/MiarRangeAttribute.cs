using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.Attributes
{
	public class MiarRangeAttribute : ValidationAttribute
	{
		private readonly int _minValue;
		private readonly int _maxValue;
		private readonly string _displayNameInTR;
		private readonly string _displayNameInEN;

		public MiarRangeAttribute(
			int minLength,
			int maxLength,
			string displayNameInTR,
			string displayNameInEN)
		{
			_minValue = minLength;
			_maxValue = maxLength;
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

			#region when value less than min value (throw)
			if ((int)value < _minValue)
				throw new ErrorWithCodeException(
					400,
					"FE-MinV",
					"Format Error - Minimum Value",
					JsonSerializer.Serialize(new
					{
						TR = $"'{_displayNameInTR}' en az `{_minValue}` değerini alabilir",
						EN = $"'{_displayNameInEN}' can take min `{_minValue}` value"
					}));
			#endregion

			#region when max value exceeded (throw)
			else if ((int)value > _maxValue)
				throw new ErrorWithCodeException(
					400,
					"FE-MaxV",
					"Format Error - Maximum Value",
					JsonSerializer.Serialize(new
					{
						TR = $"'{_displayNameInTR}' en fazla `{_maxValue}` değerini alabilir",
						EN = $"'{_displayNameInEN}' can take max `{_maxValue}` value"
					}));
			#endregion

			return null;
		}
	}
}
