using Entities.DtoModels.MachineDtos;
using Entities.QueryModels;
using Entities.QueryParameters;
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
			[FromBody] MachineDtoForCreate machineDto)
		{
			await _manager.MachineService
				.CreateMachineAsync(machineDto);

			return NoContent();
		}


		[HttpGet("display/all")]
		public async Task<IActionResult> GetAllMachinesAsync(
			[FromQuery(Name = "Language")] string language,
			[FromQuery] PaginationParameters pagingParameters)
		{
			var machines = await _manager.MachineService
				.GetAllMachinesAsync(language, pagingParameters, Response);

			return Ok(machines);
		}


        [HttpPut("update")]
        [ValidationNullArguments]
        public async Task<IActionResult> UpdateMachineAsync(
            [FromQuery] MachineParametersForUpdate machineParameters,
            [FromBody] MachineDtoForUpdate machineDto)
        {
            await _manager.MachineService
                .UpdateMachineAsync(machineParameters, machineDto);

            return NoContent();
        }



        //      [HttpGet("display/condition")]
        //      [ValidationNullArguments]
        //      public async Task<IActionResult> GetMachinesByConditionAsync(
        //          [FromQuery] MachineBodyDtoForDisplay machineDtoD,
        //          [FromQuery] PaginationQueryDto paginationQueryDto)
        //      {
        //          var machines = await _manager.MachineService
        //              .GetMachinesByConditionWithPagingAsync(
        //                  machineDtoD,
        //			paginationQueryDto, 
        //                  Response);

        //          return Ok(machines);
        //      }


        //      [HttpGet("display/subCategories/{MainCategoryName}")]
        //      public async Task<IActionResult> GetSubCategoriesOfMainCategoryAsync(
        //          [FromRoute(Name = "MainCategoryName")] string mainCategoryName)
        //      {
        //          var subCategories = await _manager.MachineService
        //              .GetSubCategoriesOfMainCategoryAsync(mainCategoryName);

        //          return Ok(subCategories);
        //      }

        //      [HttpDelete("delete")]
        //      [ValidationNullArguments]
        //      public async Task<IActionResult> DeleteMachinesAsync(
        //          [FromBody] MachineBodyDtoForDelete machineBodyDto)
        //      {
        //          await _manager.MachineService
        //              .DeleteMachinesAsync(machineBodyDto);

        //          return NoContent();
        //      }
    }
}
