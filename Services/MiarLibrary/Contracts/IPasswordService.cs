using Entities.MiarLibrary.DtoModels;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;

namespace Services.MiarLibrary.Contracts
{
    public interface IPasswordService
    {
		Task UpdatePasswordAsync(
			LanguageParams languageParams,
			PasswordDtoForUpdate passwordDto,
			HttpContext context);
	}
}
