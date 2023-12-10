using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.Attributes
{
	public class MiarRangeAttribute : ValidationAttribute
	{
		private readonly int _minValue;
		private readonly int _maxValue;

		public MiarRangeAttribute(int minValue, int maxValue)
		{
			_minValue = minValue;
			_maxValue = maxValue;
		}

		protected override ValidationResult? IsValid(
			object? value,
			ValidationContext validationContext)
		{
			#region when value null then don't look
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
						PropertyName = validationContext.MemberName,
						MinValue = _minValue
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
						PropertyName = validationContext.MemberName,
						MaxValue = _maxValue
					}));
			#endregion

			return null;
		}
	}
}
