using Entities.DtoModels.SliderDtos;
using Entities.QueryParameters;
using Entities.ViewModels;


namespace Services.Contracts
{
    public interface IFileService
    {
		Task UploadSlidersToDbAsync(SliderDtoForUploadToDb sliderDto);

		Task UploadSliderToFolderAsync(
			SliderParametersForUploadToFolder sliderParams,
            SliderDtoForUploadToFolder sliderDto);

		Task<IEnumerable<SliderView>> GetAllSlidersAsync(
            SliderParamatersForDisplayAll sliderParams);

        Task<string> GetSliderPathBySliderNoAsync(
            SliderParametersForDisplayOne sliderParams);

        Task DeleteMultipleSliderAsync(
			SliderParametersForDeleteMultiple sliderParams,
			SliderDtoForDelete sliderDto);

		Task DeleteOneSliderAsync(
			string language,
			string folderPathAfterWwwroot,
			string fileName);
	}
}
