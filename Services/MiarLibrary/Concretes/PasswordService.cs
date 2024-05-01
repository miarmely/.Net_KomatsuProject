using Dapper;
using Entities.Exceptions;
using Entities.MiarLibrary.DtoModels;
using Entities.QueryParameters;
using Miarmely.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Repositories.Contracts;
using Services.MiarLibrary.Contracts;
using System.Security.Claims;
using System.Text.Json;

namespace Services.MiarLibrary.Concretes
{
    public class PasswordService : IPasswordService
    {
		private readonly IRepositoryManager _repos;
        private readonly IMiarService _miar;
        
        public PasswordService(
			IRepositoryManager manager,
            IMiarService miar)
        {
			_repos = manager;
            _miar = miar;
		}

        public async Task UpdatePasswordAsync(
            LanguageParams languageParams,
            PasswordDtoForUpdate passwordDto,
            HttpContext context)
        {
            #region when "new password again" is not equal to "new password" (THROW)
            if (!passwordDto.NewPassword.Equals(passwordDto.NewPasswordAgain))
                throw new ExceptionWithMessage(
                    400,
                    "FE-P-NP",
                    "Format Error - Password - New Passwords",
                    JsonSerializer.Serialize(new
                    {
                        TR = "'yeni şifre tekrar' ile 'yeni şifre' aynı değil",
                        EN = "'new password again' is not same with 'new password'",
                    }));
			#endregion

			#region set parameters
			var parameters = new DynamicParameters();
			
			parameters.AddDynamicParams(new
            {
                Language = languageParams.Language,
				#region UserId
				UserId = await _miar.GetUserIdFromClaimsAsync(
					context,
                    ClaimTypes.NameIdentifier),
				#endregion
				HashedOldPass = await _miar.ComputeMd5Async(passwordDto.OldPassword),
                HashedNewPass = await _miar.ComputeMd5Async(passwordDto.NewPassword)
            });
            #endregion

            #region update password (THROW)
            var errorDto = await _repos.PasswordRepository
                .UpdatePasswordAsync(parameters);

            // when any error occured
            if (errorDto.StatusCode != 204)
                throw new ExceptionWithMessage(errorDto);
			#endregion
		}
	}
}
