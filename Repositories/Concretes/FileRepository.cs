using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.ViewModels;
using Repositories.Contracts;

namespace Repositories.Concretes
{
    public class FileRepository : RepositoryBase, IFileRepository
    {
        public FileRepository(
            RepositoryContext context,
            IConfigManager configs)
            : base(context, configs)
            {}

        public async Task UploadSlidersAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<int>(
                base.Configs.DbSettings.ProcedureNames.S_Create,
                parameters);

        public async Task<IEnumerable<SliderView>?> GetAllSlidersAsync(
            DynamicParameters parameters) =>
            await base.QueryAsync<SliderView>(
                base.Configs.DbSettings.ProcedureNames.S_DisplayAll,
                parameters);

        public async Task<string?> GetSliderPathBySliderNoAsync(
            DynamicParameters parameters) =>
                await base.QuerySingleOrDefaultAsync<string>(
                    Configs.DbSettings.ProcedureNames
                        .S_DisplaySliderPathBySliderNo,
                    parameters);

        public async Task DeleteMultipleSliderAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<int>(
               base.Configs.DbSettings.ProcedureNames.S_DeleteMultipleByFileNames,
               parameters);
                
        public async Task DeleteOneSliderAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<int>(
                Configs.DbSettings.ProcedureNames.S_DeleteOneBySliderNo,
                parameters);
    }
}
