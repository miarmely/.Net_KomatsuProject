using Entities.MiarLibrary.QueryParameters;


namespace Services.Contracts
{
    public interface IOTPService
	{
		Task<object> SendVerificationCodeAsync(OTPParamsForAdd otpDto);
		Task<object> VerifyCodeAsync(OTPParamsForVerify otpParams);
	}
}
