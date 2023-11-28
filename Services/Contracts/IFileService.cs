using Entities.DtoModels.SliderDtos;
using Entities.ViewModels;


namespace Services.Contracts
{
    public interface IFileService
    {
        Task UploadSliderAsync(SliderDtoForUpload sliderDto);
        Task<IEnumerable<SliderView>> GetAllSlidersAsync(string language);
        Task<string> GetSliderPathBySliderNoAsync(string language, int sliderNo);
        Task DeleteMultipleSliderAsync(
            string language,
            string folderPathAfterWwwroot, 
            SliderDtoForMultipleDelete sliderDto);
    }
}
