using Entities.DtoModels;
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

		[HttpPost("display")]
		public async Task<IActionResult> GetMachinesByConditionAsync(
			[FromBody] MachineDtoForSearch machineDtoS)
		{
			var entity = await _services.MachineService
				.GetMachinesByConditionAsync(machineDtoS);
			
			return Ok(entity);
		}


		[HttpPost("create")]
		public async Task<IActionResult> CreateMachineAsync(
			[FromBody] MachineDto machineDto)
		{

		}

	}
}
