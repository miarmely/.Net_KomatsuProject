using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Repositories.Concretes;
using Repositories.MiarLibrary.Contracts;


namespace Repositories.MiarLibrary.Concretes
{
	public class PasswordRepository : RepositoryBase, IPasswordRepository
	{
        public PasswordRepository(
			RepositoryContext context, 
			IConfigManager manager) : base(context, manager)
        {}

        public async Task<ErrorDtoWithMessage> UpdatePasswordAsync(
			DynamicParameters parameters) =>
				await ExecuteAsync(
					Configs.DbSettings.ProcedureNames.Mi_Password_Update,
					parameters);
	}
}