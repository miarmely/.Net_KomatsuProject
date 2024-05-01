using Entities.Exceptions;
using System.ComponentModel.DataAnnotations;


namespace Entities.MiarLibrary.Attributes
{
    public class MiarPasswordAttribute : ValidationAttribute
    {
        private readonly bool _checkUpperCase;
        private readonly bool _checkLowerCase;
        private readonly bool _checkNumber;
        private readonly char[]? _validSpecialChars;
        private readonly int _minUpperCaseCount;
        private readonly int _minLowerCaseCount;
        private readonly int _minNumberCount;
        private readonly string _displayNameInTR;
        private readonly string _displayNameInEN;

        public MiarPasswordAttribute(
            bool checkUpperCase = false,
            bool checkLowerCase = false,
            bool checkNumber = false,
            char[]? validSpecialChars = null,
            int minUpperCaseCount = 0,
            int minLowerCaseCount = 0,
            int minNumberCount = 0,
            string displayNameInTR = "",
            string displayNameInEN = "")
        {
            _checkUpperCase = checkUpperCase;
            _checkLowerCase = checkLowerCase;
            _checkNumber = checkNumber;
            _validSpecialChars = validSpecialChars;
            _minUpperCaseCount = minUpperCaseCount;
            _minLowerCaseCount = minLowerCaseCount;
            _minNumberCount = minNumberCount;
            _displayNameInTR = displayNameInTR;
            _displayNameInEN = displayNameInEN;
        }

        protected override ValidationResult? IsValid(
            object? value,
            ValidationContext validationContext)
        {
            #region when value is null (return)
            if (value == null)
                return ValidationResult.Success;
            #endregion

            #region scan the password
            var password = value.ToString();
            var counter = new Dictionary<string, int>
            {
                {"UpperCase", 0},
                {"LowerCase", 0},
                {"Number", 0},
                {"InvalidSpecialChar", 0},
            };

            foreach (var chr in password)
            {
                #region when upperCase char is exists
                if (_checkUpperCase
                    && (chr >= 'A' && chr <= 'Z'))
                {
                    counter["UpperCase"]++;
                }
                #endregion

                #region when lowerCase char is exists
                if (_checkUpperCase
                    && (chr >= 'a' && chr <= 'z'))
                {
                    counter["LowerCase"]++;
                }
                #endregion

                #region when number char is exists
                if (_checkUpperCase
                    && (chr >= '0' && chr <= '9'))
                {
                    counter["Number"]++;
                }
                #endregion

                #region when invalid special char is exists
                if (_validSpecialChars != null  // when special char checking is desired
                    && !(chr >= 'A' && chr <= 'Z')  // when char is not uppercase
                    && !(chr >= 'a' && chr <= 'z')  // when char is not lowercase
                    && !(chr >= '0' && chr <= '9')    // when char is not number
                    && !_validSpecialChars.Any(c => c.Equals(chr))) // when char is invalid
                {
                    counter["InvalidSpecialChar"]++;
                }
                #endregion
            }
            #endregion

            #region set error message
            var errorMessage = "";

            #region when upperCase, lowerCase or number count is invalid
            if ((_checkUpperCase && counter["UpperCase"] < _minUpperCaseCount)
                || (_checkLowerCase && counter["LowerCase"] < _minLowerCaseCount)
                || (_checkNumber && counter["Number"] < _minNumberCount))
            {
                errorMessage = $"\"{_displayNameInTR}\"; ";

                #region when uppercase count is invalid
                if (_checkUpperCase
                    && counter["UpperCase"] < _minUpperCaseCount)
                    errorMessage += $" en az {_minUpperCaseCount} tane büyük harf,";
                #endregion

                #region when uppercase count is invalid
                if (_checkLowerCase
                    && counter["LowerCase"] < _minLowerCaseCount)
                    errorMessage += $" en az {_minLowerCaseCount} tane küçük harf,";
                #endregion

                #region when uppercase count is invalid
                if (_checkNumber
                    && counter["Number"] < _minNumberCount)
                    errorMessage += $" en az {_minNumberCount} tane sayı,";
                #endregion

                #region when last char is comma (delete)
                var lastChar = errorMessage[errorMessage.Length - 1];

                if (lastChar == ',')
                    errorMessage = errorMessage.Remove(errorMessage.Length - 1, 1);
                #endregion

                errorMessage += " içermelidir. ";
            }
            #endregion

            #region when invalid special chars is exists
            if (_validSpecialChars != null  // when special chars checking is desired
                && counter["InvalidSpecialChar"] > 0)
            {
                errorMessage += $"\"{_displayNameInTR}\"; ingilizce karakterlerden oluşmalıdır ve sadece [{string.Join(' ', _validSpecialChars)}] özel karakterlerini içerebilir";
            }
            #endregion

            #endregion

            #region when conditions is not provided (throw)
            if (!errorMessage.Equals(""))
            {
                var first2CharOfDisplayName = _displayNameInEN.Substring(0, 2);

                throw new ExceptionWithMessage(
                    404,
                    "FE-V-" + first2CharOfDisplayName,
                    "Format Error - Validation - " + _displayNameInEN,
                    errorMessage);
            }
            #endregion

            return ValidationResult.Success;
        }
    }
}