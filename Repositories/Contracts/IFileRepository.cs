using Dapper;
using Entities.ViewModels;

namespace Repositories.Contracts
{
    public interface IFileRepository : IRepositoryBase
    {
        Task UploadSlidersAsync(DynamicParameters parameters);
        Task<string?> GetSliderPathBySliderNoAsync(DynamicParameters parameters);
        Task TruncateAllSlidersAsync();
        Task DeleteOneSliderAsync(DynamicParameters parameters);

		Task<IEnumerable<SliderView>?> GetAllSlidersAsync(
			DynamicParameters parameters);
	}
}
