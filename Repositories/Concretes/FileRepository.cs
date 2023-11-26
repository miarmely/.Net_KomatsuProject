using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.ViewModels;
using Repositories.Contracts;

namespace Repositories.Concretes
{
    public class FileRepository : RepositoryBase, IFileRepository
    {
        private readonly IConfigManager _configs;

        public FileRepository(
            RepositoryContext context,
            IConfigManager configs)
            : base(context, configs) =>
            _configs = configs;

        public async Task UploadSliderAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<int>(
                base.Configs.DbSettings.ProcedureNames.Slider_Create,
                parameters);

        public async Task<IEnumerable<SliderView>?> GetAllSlidersAsync(
            DynamicParameters parameters) =>
            await base.QueryAsync<SliderView>(
                base.Configs.DbSettings.ProcedureNames.Slider_DisplayAll,
                parameters);

        public async Task<string?> GetSliderPathBySliderNoAsync(
            DynamicParameters parameters) =>
                await base.QuerySingleOrDefaultAsync<string>(
                    Configs.DbSettings.ProcedureNames
                        .Slider_DisplaySliderPathBySliderNo,
                    parameters);

        public async Task TruncateAllSlidersAsync() =>
            await base.QueryAsync<int>($@"
                TRUNCATE TABLE {_configs.DbSettings.TableNames.Sliders}");        
    }
}
