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


		//[HttpPost("create")]
		//public async Task<IActionResult> CreateMachineAsync(
		//	[FromBody] MachineBodyDtoForCreate machineBodyDto)
		//{
		//	await _manager.MachineService
		//		.CreateMachineAsync(machineBodyDto);

		//	return NoContent();
		//}


		//[HttpGet("display/all")]
		//public async Task<IActionResult> GetAllMachinesAsync(
  //          [FromQuery] PaginationQueryDto paginationQueryDto)
  //      {
  //          var machines = await _manager.MachineService
  //              .GetAllMachinesWithPagingAsync(paginationQueryDto, Response);

  //          return Ok(machines);
  //      }


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


  //      [HttpPut("update")]
  //      [ValidationNullArguments]
  //      public async Task<IActionResult> UpdateMachineAsync(
  //          [FromQuery] MachineQueryDtoForUpdate machineQueryDto,
  //          [FromBody] MachineBodyDtoForUpdate machineBodyDto)
  //      {
  //          await _manager.MachineService
  //              .UpdateMachineAsync(machineQueryDto, machineBodyDto);

  //          return NoContent();
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
