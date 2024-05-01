using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;


namespace Entities.MiarLibrary.Attributes
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
            var first2CharOfDisplayNameInEN = _displayNameInEN.Substring(0, 2);

            if (_minLength == _maxLength
                && valueInString.Length != _minLength)
                throw new ExceptionWithMessage(
                    400,
                    $"FE-NE-L-{first2CharOfDisplayNameInEN}",
                    $"Format Error - Not Equal - Length - {_displayNameInEN}",
                    $"\"{_displayNameInTR}\", '{_minLength}' karakter uzunluğunda olmalı");
            #endregion

            #region when value smaller than min length (throw)
            if (_minLength != -1 // when min length control wanting
                && valueInString.Length < _minLength)
                throw new ExceptionWithMessage(
                    400,
                    $"FE-MinL-{first2CharOfDisplayNameInEN}",
                    $"Format Error - Minimum Length - {_displayNameInEN}",
                    $"\"{_displayNameInTR}\", en az '{_minLength}' karakterden oluşmalı");
            #endregion

            #region when max length exceeded (throw)
            else if (_maxLength != -1  // when max length control wanting
                && valueInString.Length > _maxLength)
                throw new ExceptionWithMessage(
                    400,
                    $"FE-MaxL-{first2CharOfDisplayNameInEN}",
                    $"Format Error - Maximum Length - {_displayNameInEN}",
                    $"\"{_displayNameInTR}'\" en fazla '{_maxLength}' karakterden oluşmalı");
            #endregion

            return null;
        }
    }
}