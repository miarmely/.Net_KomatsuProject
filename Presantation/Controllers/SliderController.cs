using Entities.DtoModels.SliderDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.ComponentModel.DataAnnotations;


namespace Presantation.Controllers
{
	[Route("api/services/[Controller]")]
	[ApiController]
	public partial class SliderController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public SliderController(IServiceManager manager) =>
			_manager = manager;


		[HttpPost("upload/folder")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> UploadSliderToFolder(
			[FromQuery] SliderParametersForUploadToFolder sliderParams,
			[FromBody] SliderDtoForUploadToFolder sliderDto)
		{
			await _manager.SliderService
				.UploadSliderToFolderAsync(sliderParams, sliderDto);

			return NoContent();
		}


		[HttpPost("upload/db")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> UploadSlidersToDb(
			[FromQuery(Name = "language")][Required] string language, // authorization
			[FromBody] SliderDtoForUploadToDb sliderDto)
		{
			await _manager.SliderService
				.UploadSlidersToDbAsync(sliderDto);

			return NoContent();
		}


		[HttpGet("display/all")]
		[Authorization]
		public async Task<IActionResult> GetAllSliders(
			[FromQuery] SliderParamatersForDisplayAll sliderParams)
		{
			var sliderViews = await _manager.SliderService
				.GetAllSlidersAsync(sliderParams);

			return Ok(sliderViews);
		}


		[HttpGet("display/one")]
		[Authorization]
		public async Task<IActionResult> GetSliderPathBySliderNo(
			[FromQuery] SliderParametersForDisplayOne sliderParams)
		{
			var sliderPath = await _manager.SliderService
				.GetSliderPathBySliderNoAsync(sliderParams);

			return Ok(new
			{
				sliderPath
			});
		}


		[HttpPost("delete/multiple")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> DeleteMultipleSlider(
			[FromQuery] SliderParametersForDeleteMultiple sliderParams,
			[FromBody] SliderDtoForDeleteMultiple sliderDto)
		{
			await _manager.SliderService.DeleteMultipleSliderAsync(
				sliderParams,
				sliderDto);

			return NoContent();
		}


		[HttpPost("delete/one")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> DeleteOneSlider(
			[FromQuery] SliderParametersForDeleteOne sliderParams)
		{
			await _manager.SliderService.DeleteOneSliderAsync(
				sliderParams.Language,
				sliderParams.FolderPathAfterWwwroot,
				sliderParams.FileName);

			return NoContent();
		}        
    }
}
