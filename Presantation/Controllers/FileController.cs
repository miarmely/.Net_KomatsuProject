using Entities.DtoModels;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Utilities.Encoders;
using Presantation.Attributes;

namespace Presantation.Controllers
{
    [Route("api/services/[Controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost("upload")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> UploadSliderImg(
            [FromBody] ImgFileDto imgFileDto)
        {
            #region set path of sliders folder
            // remove "Temsa_Api" path and add "Temsa_Web/..." path
            var currentDirectory = Directory
                .GetCurrentDirectory()
                .Replace(
                    "Temsa_Api", 
                    $"Temsa_Web\\wwwroot\\images\\sliders\\{imgFileDto.FileName}");

            #endregion

            #region upload img to file path
            var contentInBytes = Base64.Decode(imgFileDto.ContentInBase64Str);
            
            await System.IO.File
                .WriteAllBytesAsync(currentDirectory, contentInBytes);
            #endregion

            return NoContent();
        }
    }
}
