using Entities.DtoModels.SliderDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;


namespace Presantation.Controllers
{
	public partial class FileController
	{
		[HttpPost("slider/upload/folder")]
		//[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> UploadSliderToFolder(
			[FromQuery] SliderParametersForUploadToFolder sliderParams,
			[FromBody] SliderDtoForUploadToFolder sliderDto)
		{
			await _manager.FileService
				.UploadSliderToFolderAsync(sliderParams, sliderDto);

			return NoContent();
		}


		[HttpPost("slider/upload/db")]
		//[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> UploadSlidersToDb(
			[FromQuery(Name = "language")][Required] string language, // authorization
			[FromBody] SliderDtoForUploadToDb sliderDto)
		{
			await _manager.FileService
				.UploadSlidersToDbAsync(sliderDto);

			return NoContent();
		}


		[HttpGet("slider/display/all")]
		//[Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
		public async Task<IActionResult> GetAllSliders(
			[FromQuery] SliderParamatersForDisplayAll sliderParams)
		{
			var sliderViews = await _manager.FileService
				.GetAllSlidersAsync(sliderParams);

			return Ok(sliderViews);
		}


		[HttpGet("slider/display/one")]
		//[Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
		public async Task<IActionResult> GetSliderPathBySliderNo(
			[FromQuery] SliderParametersForDisplayOne sliderParams)
		{
			var sliderPath = await _manager.FileService
				.GetSliderPathBySliderNoAsync(sliderParams);

			return Ok(new
			{
				sliderPath
			});
		}


		[HttpDelete("slider/delete/multiple")]
		//[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> DeleteMultipleSlider(
			[FromQuery] SliderParametersForDeleteMultiple sliderParams,
			[FromBody] SliderDtoForDeleteMultiple sliderDto)
		{
			await _manager.FileService.DeleteMultipleSliderAsync(
				sliderParams,
				sliderDto);

			return NoContent();
		}


		[HttpDelete("slider/delete/one")]
		//[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> DeleteOneSlider(
			[FromQuery] SliderParametersForDeleteOne sliderParams)
		{
			await _manager.FileService.DeleteOneSliderAsync(
				sliderParams.Language,
				sliderParams.FolderPathAfterWwwroot,
				sliderParams.FileName);

			return NoContent();
		}
}
}
