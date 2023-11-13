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


        [HttpPost("upload")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> UploadSliderImage(
            [FromBody] ImageFileDto imageFileDto)
        {
            await _manager.FileService
                .UploadSliderImageAsync(imageFileDto);

            return NoContent();
        }
    }
}
