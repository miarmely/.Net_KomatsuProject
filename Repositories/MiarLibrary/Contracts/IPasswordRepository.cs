using Dapper;
using Entities.DtoModels;
using Repositories.Contracts;


namespace Repositories.MiarLibrary.Contracts
{
	public interface IPasswordRepository : IRepositoryBase
	{
		Task<ErrorDtoWithMessage> UpdatePasswordAsync(DynamicParameters parameters);
		Task<ErrorDtoWithMessage> UpdatePasswordByOTPAsync(DynamicParameters parameters);
	}
}