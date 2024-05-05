using Entities.MiarLibrary.DtoModels;
using Entities.MiarLibrary.QueryParameters;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;


namespace Presantation.Controllers.MiarLibrary
{
    [ApiController]
	[Route("api/services/[Controller]")]
	public class PasswordController : ControllerBase
	{
        private readonly IServiceManager _services;

		public PasswordController(IServiceManager services)
		{
			_services = services;
		}


		[HttpPost("update")]
		[Authorization]
		public async Task<IActionResult> UpdatePasswordOfUser(
			[FromQuery] LanguageParams languageParams,
			[FromBody] PasswordDtoForUpdate passwordDto)
		{
			var response = await _services.PasswordService.UpdatePasswordAsync(
				languageParams, 
				passwordDto, 
				HttpContext);

			return Ok(response);
		}


		[HttpGet("forgotPassword/sendVerificationCode")]
		public async Task<IActionResult> SendVerificationCode(
			[FromQuery] OTPParamsForAdd otpParams)
		{
			var response = await _services.OTPService
				.SendVerificationCodeAsync(otpParams);

			return Ok(response);
		}


		[HttpGet("forgotPassword/verifyCode")]
		public async Task<IActionResult> VerifyCode(
			[FromQuery] OTPParamsForVerify otpParams)
		{
			var response = await _services.OTPService.VerifyCodeAsync(otpParams);

			return Ok(response);
		}


		[HttpPost("forgotPassword/newPassword")]
		public async Task<IActionResult> VerifyCode(
			[FromQuery] LanguageParams languageParams,
			[FromBody] PasswordDtoForUpdateByOTP passwordDto)
		{
			var response = await _services.PasswordService
				.UpdatePasswordByOTPAsync(languageParams, passwordDto);

			return Ok(response);
		}
	}
}
