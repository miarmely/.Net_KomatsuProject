using Entities.DtoModels.SliderDtos;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.ComponentModel.DataAnnotations;

namespace Presantation.Controllers
{
    [Route("api/services/[Controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IServiceManager _manager;

        public FileController(IServiceManager manager) =>
            _manager = manager;


        [HttpPost("slider/upload")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> UploadSlider(
            [FromQuery(Name = "language")][Required] string language, // for authorization
            [FromBody] SliderDtoForUpload sliderDto)
        {
            await _manager.FileService
                .UploadSliderAsync(sliderDto);

            return NoContent();
        }


        [HttpGet("slider/display/all")]
        [Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task<IActionResult> GetAllSliders(
            [FromQuery(Name = "language")][Required] string language)
        {
            var sliderViews = await _manager.FileService
                .GetAllSlidersAsync(language);

            return Ok(sliderViews);
        }


        [HttpGet("slider/display/one")]
        [Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task<IActionResult> GetSliderBySliderNo(
            [FromQuery(Name = "language")][Required] string language,
            [FromQuery(Name = "sliderNo")][Required] int sliderNo)
        {
            var sliderPath = await _manager.FileService
                .GetSliderPathBySliderNoAsync(language, sliderNo);

            return Ok(sliderPath);
        }


        [HttpDelete("slider/delete/multiple")]
        //[Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> DeleteMultipleSlider(
         [FromQuery(Name = "language")][Required] string language,  // for authorization
         [FromQuery(Name = "folderPath")][Required] string folderPathAfterWwwroot,
         [FromBody] SliderDtoForMultipleDelete sliderDto)
        {
            await _manager.FileService
                .DeleteMultipleSliderAsync(language, folderPathAfterWwwroot, sliderDto);

            return NoContent();
        }
    }
}
