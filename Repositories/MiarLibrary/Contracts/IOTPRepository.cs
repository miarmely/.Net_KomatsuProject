using Dapper;
using Entities.DtoModels;
using Repositories.Contracts;
using System.Data;

namespace Repositories.MiarLibrary.Contracts
{
	public interface IOTPRepository : IRepositoryBase
	{
		Task AddOTPAsync(
			DynamicParameters parameters,
			Func<IDbTransaction, Task> funcInTransactionAsync);

		Task<ErrorDtoWithMessage> VerifyOTPAsync(DynamicParameters parameters);
	}
}