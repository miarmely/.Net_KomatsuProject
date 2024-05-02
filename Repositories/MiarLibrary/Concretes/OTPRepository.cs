using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Concretes;
using Repositories.MiarLibrary.Contracts;
using System.Data;

namespace Repositories.MiarLibrary.Concretes
{
	public class OTPRepository : RepositoryBase, IOTPRepository
	{
        public OTPRepository(RepositoryContext context, IConfigManager manager) 
            : base(context, manager)
        {}

		public async Task AddOTPAsync(
			DynamicParameters parameters,
			Func<IDbTransaction, Task> funcInTransactionAsync) => 
				await ExecuteWithTransactionAsync(
					Configs.DbSettings.ProcedureNames.Mi_OTP_Add,
					parameters,
					funcInTransactionAsync);

		public async Task<ErrorDtoWithMessage> VerifyOTPAsync(
			DynamicParameters parameters) => 
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.Mi_OTP_Verify,
					parameters);
	}
}