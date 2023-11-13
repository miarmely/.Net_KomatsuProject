using Entities.DtoModels;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;


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
        public async Task<IActionResult> UploadSliderImage(
            [FromBody] SliderDto sliderDto)
        {
            await _manager.FileService
                .UploadSlidersAsync(sliderDto);

            return NoContent();
        }


        [HttpDelete("slider/delete")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> DeleteAllSliders(
            [FromQuery(Name = "path")] string pathAfterWwwroot)
        {
            await _manager.FileService
                .DeleteAllSlidersAsync(pathAfterWwwroot);

            return NoContent();
        }


        [HttpGet("slider/display")]
        [Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task <IActionResult> GetAllSliders()
        {
            var sliderViews = await _manager.FileService
                .GetAllSlidersAsync();

            return Ok(sliderViews);
        }
    }
}
