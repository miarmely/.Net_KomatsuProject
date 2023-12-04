using Entities.DtoModels.SliderDtos;
using Entities.QueryParameters;
using Entities.ViewModels;

namespace Services.Contracts
{
	public interface ISliderService
	{
		Task UploadSliderToFolderAsync(
			SliderParametersForUploadToFolder sliderParams, 
			SliderDtoForUploadToFolder sliderDto);

		Task UploadSlidersToDbAsync(SliderDtoForUploadToDb sliderDto);

		Task<IEnumerable<SliderView>> GetAllSlidersAsync(
			SliderParamatersForDisplayAll sliderParams);

		Task<string> GetSliderPathBySliderNoAsync(
			SliderParametersForDisplayOne sliderParams);

		Task DeleteMultipleSliderAsync(
			SliderParametersForDeleteMultiple sliderParams, 
			SliderDtoForDeleteMultiple sliderDto);

		Task DeleteOneSliderAsync(
			string language, 
			string folderPathAfterWwwroot, 
			string fileName);		
	}
}