using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.Exceptions;
using MimeKit.Text;
using MimeKit;
using Repositories.Contracts;
using Services.Contracts;
using Entities.MiarLibrary.QueryParameters;
using System.Data;

namespace Services.Concretes
{
	public class OTPService : IOTPService
	{
		private readonly IRepositoryManager _repos;
		private readonly IConfigManager _configs;
		private readonly IMailService _mailService;

		public OTPService(
			IRepositoryManager repos,
			IConfigManager configs,
			IMailService mailService)
		{
			_repos = repos;
			_configs = configs;
			_mailService = mailService;
		}

		public async Task<object> SendVerificationCodeAsync(
			OTPParamsForAdd otpParams)
		{
			#region generate verification code
			var random = new Random();
			var verificationCode = "";

			for (int repeat = 0; repeat < 6; repeat++)
			{
				verificationCode += random
					.Next(0, 9)
					.ToString();
			}
			#endregion

			#region set parameters	
			var parameters = new DynamicParameters(new
			{
				Language = otpParams.Language,
				Email = otpParams.Email,
				VerificationCode = verificationCode,
				CreatedDate = DateTime.UtcNow,
				#region ExpiredDate
				ExpiredDate = DateTime.UtcNow
					.AddSeconds(_configs.OTPSettings.Expires),
				#endregion
			});
			#endregion

			#region add otp and send mail to user (THROW)
			await _repos.OTPRepository.AddOTPAsync(parameters, async (transaction) =>
			{
				#region when any error is occured (THROW)
				if (parameters.Get<Int16>("StatusCode") != 204)
				{
					transaction.Rollback();

					throw new ExceptionWithMessage(
						parameters.Get<Int16>("StatusCode"),
						parameters.Get<string>("ErrorCode"),
						parameters.Get<string>("ErrorDescription"),
						parameters.Get<string>("ErrorMessage"));
				}
				#endregion

				#region send verification code to mail of user
				var subject = otpParams.Language switch
				{
					"TR" => "Komatsu - Doğrulama Kodu",
					"EN" => "Komatsu - Verification Code"
				};
				var body = otpParams.Language switch
				{
					"TR" => "Şifreni değiştirmek için bu doğrulama kodunu kullanabilirsin:",
					"EN" => "You can use this verification code for change your password:"
				};

				await _mailService.SendMailAsync(
					new List<string> { otpParams.Email },
					subject,
					new TextPart(TextFormat.Html)
					{
						Text = string.Format(@"
							<h4>{0}</h4>
							<h2>{1}</h2>", body, verificationCode)
					});
				#endregion

				transaction.Commit();
			});
			#endregion

			return otpParams.Language switch
			{
				"TR" => new { Message = "başarılı", Email = otpParams.Email },
				"EN" => new { Message = "successful", Email = otpParams.Email }
			};
		}

		public async Task<object> VerifyCodeAsync(
			OTPParamsForVerify otpParams)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				otpParams.Language,
				otpParams.Email,
				otpParams.VerificationCode,
				RequestDate = DateTime.UtcNow
			});

			parameters.Add("OTPId", null, DbType.Guid, ParameterDirection.Output);
			#endregion

			#region verify otp (THROW)
			var errorDto = await _repos.OTPRepository.VerifyOTPAsync(parameters);

			// when any error is occured
			if (errorDto.StatusCode != 204)
				throw new ExceptionWithMessage(errorDto);
			#endregion

			return new
			{
				OTPId = parameters.Get<Guid>("OTPId"),
				Message = otpParams.Language switch
				{
					"TR" => "başarılı",
					"EN" => "successful"
				}
			};
		}
	}
}