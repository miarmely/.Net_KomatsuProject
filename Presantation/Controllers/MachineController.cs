using Entities.DtoModels.Machine;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters;
using Services.Contracts;

namespace Presantation.Controllers
{
    [ApiController]
    [Route("api/services/[Controller]")]
    [ModifyError]
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
            [FromBody] MachineDtoForCreate machineDtoC)
        {
            await _services.MachineService
                .CreateMachineAsync(machineDtoC);

            return NoContent();
        }
    }
}
