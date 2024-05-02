using Entities.MiarLibrary.Attributes;
using Entities.QueryParameters;

namespace Entities.MiarLibrary.QueryParameters
{
    public record OTPParamsForAdd : LanguageParams
    {
        [MiarLength(1, 50, "Email", "Email")]
        [MiarEnglishChars(new char[] { '.', '@' }, "Email", "Email")]
        [MiarEmail]
        public string Email { get; init; }
    }


    public record OTPParamsForVerify : OTPParamsForAdd
    {
        [MiarLength(6, 6, "Doğrulama Kodu", "Verification Code")]
        public string VerificationCode { get; init; }
    }
}