using Entities.DtoModels.SliderDtos;
using Entities.QueryParameters;
using Entities.ViewModels;


namespace Services.Contracts
{
    public interface IFileService
    {
        Task UploadSliderToFolderAsync(SliderDtoForUploadToFolder sliderDto);
        Task UploadSlidersToDbAsync(SliderDtoForUploadToDb sliderDto);
		Task<IEnumerable<SliderView>> GetAllSlidersAsync(
            SliderParamatersForDisplayAll sliderParams);
        Task<string> GetSliderPathBySliderNoAsync(
            SliderParametersForDisplayOne sliderParams);
        Task DeleteMultipleSliderAsync(
			SliderParametersForDelete sliderParams,
			SliderDtoForDelete sliderDto);
    }
}
