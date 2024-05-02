using Entities.MiarLibrary.DtoModels;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;


namespace Services.MiarLibrary.Contracts
{
    public interface IPasswordService
    {
		Task<object> UpdatePasswordAsync(
			LanguageParams languageParams,
			PasswordDtoForUpdate passwordDto,
			HttpContext context);

		Task<object> UpdatePasswordByOTPAsync(
			LanguageParams languageParams,
			PasswordDtoForUpdateByOTP passwordDto);
	}
}