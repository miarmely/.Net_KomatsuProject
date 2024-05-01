using Dapper;
using Entities.DtoModels;
using Entities.Exceptions;
using Entities.MiarLibrary.DtoModels;
using Miarmely.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Repositories.Contracts;
using Services.MiarLibrary.Contracts;
using System.Data;
using System.Security.Claims;

namespace Services.MiarLibrary.Concretes
{
    public class PasswordService : IPasswordService
    {
		private readonly HttpContext _context;
		private readonly IRepositoryManager _repos;
        private readonly IMiarService _miar;
        
        public PasswordService(
			HttpContext context,
			IRepositoryManager manager,
            IMiarService miar)
        {
			_context = context;
			_repos = manager;
            _miar = miar;
		}

        public async Task UpdatePasswordAsync(PasswordDtoForUpdate passwordDto)
        {
            #region when "new password again" is not equal to "new password" (THROW)
            if (!passwordDto.NewPassword.Equals(passwordDto.NewPasswordAgain))
                throw new ExceptionWithMessage(
                    400,
                    "U-P-U-DP",
                    "User - Password - Update - Different Password",
                    "new password again is not equal to new password");
			#endregion

			#region set parameters
			var parameters = new DynamicParameters();
			
			parameters.AddDynamicParams(new
            {
                Language = passwordDto.Language,
				#region UserId
				UserId = await _miar.GetUserIdFromClaimsAsync(
                    _context,
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
            if (errorDto.ErrorCode != null)
                throw new ExceptionWithMessage(errorDto);
			#endregion
		}
	}
}
