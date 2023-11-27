using Entities.DtoModels;
using Entities.ViewModels;


namespace Services.Contracts
{
    public interface IFileService
    {
        Task UploadSliderAsync(SliderDto sliderDto);
        Task DeleteAllSlidersAsync(string language, string pathAfterWwwroot);
        Task<IEnumerable<SliderView>> GetAllSlidersAsync(string language);
        Task<string> GetSliderPathBySliderNoAsync(string language, int sliderNo);
    }
}
