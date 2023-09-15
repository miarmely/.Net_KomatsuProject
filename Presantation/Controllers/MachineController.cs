using Entities.DtoModels;
using Entities.QueryModels;
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


		[HttpPost("create")]
		public async Task<IActionResult> CreateMachineAsync(
			[FromBody] MachineDtoForCreate machineDtoC)
		{
			await _manager.MachineService
				.CreateMachineAsync(machineDtoC);

			return NoContent();
		}


		[HttpGet("display/all")]
        public async Task<IActionResult> GetAllMachinesAsync(
            [FromQuery] PagingParameters paginationParameters)
        {
            var machines = await _manager.MachineService
                .GetAllMachinesWithPagingAsync(paginationParameters, Response);

            return Ok(machines);
        }


        [HttpGet("display")]
        public async Task<IActionResult> GetMachinesByConditionAsync(
            [FromQuery] MachineDtoForDisplay machineDtoD,
            [FromQuery] PagingParameters paginationParameters)
        {
            var machines = await _manager.MachineService
                .GetMachinesByConditionWithPagingAsync(
                    machineDtoD,
                    paginationParameters, 
                    Response);

            return Ok(machines);
        }


        [HttpGet("display/subCategories/{mainCategoryName}")]
        public async Task<IActionResult> GetSubCategoriesOfMainCategoryAsync(
            [FromRoute(Name = "mainCategoryName")] string mainCategoryName)
        {
            var subCategories = await _manager.MachineService
                .GetSubCategoriesOfMainCategoryAsync(mainCategoryName);

            return Ok(subCategories);
        }
    }
}
