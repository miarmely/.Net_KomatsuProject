using Entities.MiarLibrary.DtoModels;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presantation.Controllers.MiarLibrary
{
	[ApiController]
	[Route("api/services/[Controller]")]
	public class PasswordController : ControllerBase
	{
        private readonly IServiceManager _services;

		public PasswordController(IServiceManager services)
		{
			_services = services;
		}


		[HttpPost("update")]
		public async Task<IActionResult> UpdatePasswordOfUser(
			[FromBody] PasswordDtoForUpdate passwordDto)
		{
			await _services.PasswordService.UpdatePasswordAsync(passwordDto);

			return NoContent();
		}
	}
}
