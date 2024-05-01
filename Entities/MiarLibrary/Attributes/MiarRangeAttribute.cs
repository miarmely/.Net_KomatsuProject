using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace Entities.MiarLibrary.Attributes
{
    public class MiarRangeAttribute : ValidationAttribute
    {
        private readonly int _minValue;
        private readonly int _maxValue;
        private readonly string? _displayNameInTR;
        private readonly string? _displayNameInEN;

        public MiarRangeAttribute(
            int minLength = -1,
            int maxLength = -1,
            string? displayNameInTR = null,
            string? displayNameInEN = null)
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
            var first2CharOfDisplayNameInEN = _displayNameInEN.Substring(0, 2);

            if (_minValue != -1  // when min value control is wanted
                && (int)value < _minValue)
                throw new ExceptionWithMessage(
                    400,
                    $"FE-MinV-{first2CharOfDisplayNameInEN}",
                    $"Format Error - Minimum Value - {_displayNameInEN}",
                    JsonSerializer.Serialize(new
                    {
                        TR = $"\"{_displayNameInTR}\" en az '{_minValue}' değerini alabilir",
                        EN = $"\"{_displayNameInEN}\" can take min '{_minValue}' value"
                    }));
            #endregion

            #region when max value exceeded (throw)
            else if (_maxValue != -1  // when max value control is wanted
                && (int)value > _maxValue)
                throw new ExceptionWithMessage(
                    400,
                    $"FE-MaxV-{first2CharOfDisplayNameInEN}",
                    $"Format Error - Maximum Value - {_displayNameInEN}",
                    JsonSerializer.Serialize(new
                    {
                        TR = $"\"{_displayNameInTR}\" en fazla '{_maxValue}' değerini alabilir",
                        EN = $"\"{_displayNameInEN}\" can take max '{_maxValue}' value"
                    }));
            #endregion

            return null;
        }
    }
}