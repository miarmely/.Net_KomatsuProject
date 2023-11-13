using Entities.DtoModels;
using Entities.ViewModels;

namespace Services.Contracts
{
    public interface IFileService
    {
        Task UploadSlidersAsync(SliderDto sliderDto);
        Task DeleteAllSlidersAsync(string pathAfterWwwroot);
        Task<IEnumerable<SliderView>> GetAllSlidersAsync();
    }
}
