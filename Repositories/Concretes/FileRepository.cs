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

        public async Task UploadSliderAsync(DynamicParameters parameters) =>
            await base.QuerySingleOrDefaultAsync<int>(
                base.Configs.DbSettings.ProcedureNames.Slider_Create,
                parameters);

        public async Task<IEnumerable<SliderView>> GetAllSlidersAsync() =>
            await base.QueryAsync<SliderView>(
                base.Configs.DbSettings.ProcedureNames.Slider_DisplayAll,
                null);

        public async Task TruncateAllSlidersAsync() =>
            await base.QueryAsync<int>("TRUNCATE TABLE Sliders");   
    }
}
