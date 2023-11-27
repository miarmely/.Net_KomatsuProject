using Entities.DtoModels.MachineDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.ComponentModel.DataAnnotations;

namespace Presantation.Controllers
{
    [ApiController]
    [Route("api/services/[Controller]")]
    public class MachineController : ControllerBase
    {
        private readonly IServiceManager _manager;

        public MachineController(IServiceManager services) =>
            _manager = services;


		[HttpPost("create")]
        [Authorization("Admin,Yönetici,Editor,Editör")]
        [ValidationNullArguments]
        public async Task<IActionResult> CreateMachine(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] MachineDtoForCreate machineDto)
		{
            await _manager.MachineService
				.CreateMachineAsync(language, machineDto);

			return NoContent();
		}


		[HttpGet("display/all")]
        [Authorization("Admin,Yönetici,Editor,Editör,User,Kullanıcı")]
        public async Task<IActionResult> GetAllMachines(
			[FromQuery(Name = "language")][Required] string language,
			[FromQuery] PaginationParameters pagingParameters)
		{
			var machines = await _manager.MachineService
				.GetAllMachinesAsync(language, pagingParameters, Response);   

			return Ok(machines);
		}


        [HttpGet("display/condition")]
		[Authorization("User,Kullanıcı,Editor,Editör,Admin,Yönetici")]
		public async Task<IActionResult> GetMachinesByCondition(
            [FromQuery(Name = "language")][Required] string language,
            [FromQuery] PaginationParameters pagingParameters,
            [FromQuery] MachineDtoForDisplay machineDto)
        {
            var machines = await _manager.MachineService
                .GetMachinesByConditionAsync(
                    language, 
                    pagingParameters, 
                    machineDto, 
                    Response);

            return Ok(machines);
        }


        [HttpGet("display/mainCategory")]
        [Authorization("User,Kullanıcı,Editor,Editör,Admin,Yönetici")]
        public async Task<IActionResult> GetMainCategoryNamesByLanguage(
           [FromQuery(Name = "language")][Required] string language)
        {
            var mainCategoryNames = await _manager.MachineService
                .GetMainCategoryNamesByLanguageAsync(language);

            return Ok(mainCategoryNames);
        }


        [HttpGet("display/subCategory")]
        [Authorization("User,Kullanıcı,Editor,Editör,Admin,Yönetici")]
        public async Task<IActionResult> GetSubCategoryNamesOfMainCategoryByLanguage(
            [FromQuery] MachineParametersForDisplaySubCategoryNames machineParameters)
        {
            var subCategoryNames = await _manager.MachineService
                .GetSubCategoryNamesOfMainCategoryByLanguageAsync(machineParameters);

            return Ok(subCategoryNames);
        }


        [HttpGet("display/handStatus")]
        [Authorization("Admin,Yönetici,Editor,Editör,User,Kullanıcı")]
        public async Task<IActionResult> GetAllHandStatusByLanguage(
            [FromQuery(Name = "language")][Required] string language)
        {
            var handStatuses = await _manager.MachineService
                .GetAllHandStatusByLanguageAsync(language);

            return Ok(handStatuses);
        }


        [HttpGet("display/language")]
        [Authorization("User,Kullanıcı,Editor,Editör,Admin,Yönetici")]
        public async Task<IActionResult> GetAllLanguages()
        {
            var languages = await _manager.MachineService
                .GetAllLanguagesAsync();

            return Ok(languages);
        }


        [HttpPut("update")]
        [Authorization("Admin,Yönetici,Editor,Editör")]
        [ValidationNullArguments]
        public async Task<IActionResult> UpdateMachine(
            [FromQuery][Required] MachineParametersForUpdate machineParameters,
            [FromBody] MachineDtoForUpdate machineDto)
        {
			await _manager.MachineService
                .UpdateMachineAsync(machineParameters, machineDto);

			return NoContent();
		}


        [HttpDelete("delete")]
        [Authorization("Admin,Yönetici")]
        [ValidationNullArguments]
        public async Task<IActionResult> DeleteMachines(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] MachineDtoForDelete machineDto)
        {
			await _manager.MachineService
                .DeleteMachineAsync(language, machineDto);

			return NoContent();
		}
    }
}
