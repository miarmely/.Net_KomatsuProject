using Entities.DtoModels;
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
        private readonly IServiceManager _manager;

        public MachineController(IServiceManager services) =>
            _manager = services;

        [HttpPost("display")]
        public async Task<IActionResult> GetMachinesByConditionAsync(
            [FromBody] MachineDtoForSearch machineDtoS)
        {
            var entity = await _manager.MachineService
                .GetMachinesByConditionAsync(machineDtoS);

            return Ok(entity);
        }


        [HttpGet("display/{mainCategoryName}/subCategories")]
        public async Task<IActionResult> GetSubCategoriesOfMainCategoryAsync(
            [FromRoute(Name = "mainCategoryName")] string mainCategoryName)
        {
            var subCategories = await _manager.MachineService
                .GetSubCategoriesOfMainCategoryAsync(mainCategoryName);

            return Ok(subCategories);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMachineAsync(
            [FromBody] MachineDtoForCreate machineDtoC)
        {
            await _manager.MachineService
                .CreateMachineAsync(machineDtoC);

            return NoContent();
        }
    }
}
