using Entities.DtoModels.MachineDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Presantation.Attributes;
using Services.Contracts;


namespace Presantation.Controllers
{
	[Route("api/services/[Controller]")]
	[ApiController]
	public class MachineController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public MachineController(IServiceManager services) =>
			_manager = services;


		[HttpPost("create")]
		[Authorization("Admin,Yönetici,Editor,Editör")]
		public async Task<IActionResult> CreateMachine(
			[FromQuery] MachineParamsForCreate machineParams,
			[FromBody] MachineDtoForCreate machineDto)
		{
			await _manager.MachineService
				.CreateMachineAsync(machineParams, machineDto);

			return NoContent();
		}


		[HttpGet("display/all")]
		[Authorization]
		public async Task<IActionResult> GetAllMachines(
			[FromQuery] LanguageParams languageParam,
			[FromQuery] PaginationParams pagingParameters)
		{
			var machines = await _manager.MachineService
				.GetAllMachinesAsync(
					languageParam.Language, 
					pagingParameters, 
					Response);

			return Ok(machines);
		}


		[HttpGet("display/one")]
		[Authorization]
		public async Task<IActionResult> GetOneMachineById(
			[FromQuery] MachineParamsForDisplayOneMachine machineParams)
		{
			var machineView = await _manager.MachineService
				.GetOneMachineByIdAsync(machineParams);

			return Ok(machineView);
		}


		[HttpGet("display/condition")]
		[Authorization]
		public async Task<IActionResult> GetMachinesByCondition(
			[FromQuery] PaginationParams pagingParameters,
			[FromQuery] MachineDtoForDisplay machineDto)
		{
			var machines = await _manager.MachineService
				.GetMachinesByConditionAsync(
					machineDto.Language,
					pagingParameters,
					machineDto,
					Response);

			return Ok(machines);
		}


		[HttpGet("display/mainCategory")]
		[Authorization]
		public async Task<IActionResult> GetMainCategoryNamesByLanguage(
		   [FromQuery] LanguageParams languageParam)
		{
			var mainCategoryNames = await _manager.MachineService
				.GetMainCategoryNamesByLanguageAsync(languageParam.Language);

			return Ok(mainCategoryNames);
		}


		[HttpGet("display/subCategory")]
		[Authorization]
		public async Task<IActionResult> GetSubCategoryNamesOfMainCategoryByLanguage(
			[FromQuery] MachineParamsForDisplaySubCategoryNames machineParams)
		{
			var subCategoryNames = await _manager.MachineService
				.GetSubCategoryNamesOfMainCategoryByLanguageAsync(machineParams);

			return Ok(subCategoryNames);
		}


		[HttpGet("display/handStatus")]
		[Authorization]
		public async Task<IActionResult> GetAllHandStatusByLanguage(
			[FromQuery] LanguageParams languageParam)
		{
			var handStatuses = await _manager.MachineService
				.GetAllHandStatusByLanguageAsync(languageParam.Language);

			return Ok(handStatuses);
		}


		[HttpGet("display/language")]
		[Authorization]
		public async Task<IActionResult> GetAllLanguages()
		{
			var languages = await _manager.MachineService
				.GetAllLanguagesAsync();

			return Ok(languages);
		}


		[HttpPut("update")]
		[Authorization("Admin,Yönetici,Editor,Editör")]
		public async Task<IActionResult> UpdateMachine(
			[FromQuery] MachineParamsForUpdate machineParams,
			[FromBody] MachineDtoForUpdate machineDto)
		{
			await _manager.MachineService
				.UpdateMachineAsync(machineParams, machineDto);

			return NoContent();
		}


		[HttpDelete("delete")]
		[Authorization("Admin,Yönetici")]
		public async Task<IActionResult> DeleteMachines(
			[FromQuery] MachineParamsForDelete machineParams,
			[FromBody] IEnumerable<MachineDtoForDelete> machineDtos)
		{
			await _manager.MachineService.DeleteMachineAsync(
				machineParams,
				machineDtos);	

			return NoContent();
		}
	}
}
