using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presantation.Controllers.Api
{
	[ApiController]
	[Route("api/services/[Controller]")]
	[Authorize]
	public class MachineController : ControllerBase
	{
		private readonly IServiceManager _services;

		public MachineController(IServiceManager services) =>
			_services = services;

		[HttpGet("mainCategory")]
		public async Task<IActionResult> GetMainCategoriesAsync()
		{
			
				
		}
		
	}
}
