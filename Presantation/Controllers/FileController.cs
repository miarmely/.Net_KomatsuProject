using Entities.DtoModels.FileDtos;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presantation.Controllers
{
	[ApiController]
	[Route("api/services/file")]
	public class FileController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public FileController(IServiceManager manager) =>
			_manager = manager;

        public async Task<IActionResult> UploadFileToFolder(
			[FromBody] FileDtoForUpload fileDto)
		{
			await _manager.FileService.UploadFileToFolderAsync(
				fileDto.Language,
				fileDto.FolderPathAfterWwwroot,
				fileDto.FileName,
				fileDto.FileContentInBase64Str,
				fileDto.FileType);

			return NoContent();
		}


	}
}
