using Entities.DtoModels.FormDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;


namespace Presantation.Controllers
{
	[Route("api/services/[controller]")]
	[ApiController]
	public class FormController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public FormController(IServiceManager manager) =>
			_manager = manager;
		

		[HttpPost("create/generalCommunication")]
		[Authorization("User,Kullanıcı")]
		public async Task<IActionResult> CreateGeneralCommunicationForm(
			[FromBody] GeneralCommFormDtoForCreate formDto)
		{
			await _manager.FormService
				.CreateGenaralCommFormAsync(formDto, HttpContext);

			return NoContent();
		}

		[HttpPost("create/getOffer")]
		[Authorization("User,Kullanıcı")]
		public async Task<IActionResult> CreateGetOfferForm(
			[FromQuery] LanguageParams languageParams,
			[FromBody] GetOfferFormDtoForCreate formDto)
		{
			await _manager.FormService
				.CreateGetOfferFormAsync(languageParams, formDto, HttpContext);

			return NoContent();
		}

		[HttpPost("create/renting")]
		[Authorization("User,Kullanıcı")]
		public async Task<IActionResult> CreateRentingForm(
			[FromQuery] LanguageParams languageParams,
			[FromBody] RentingFormDtoForCreate formDto)
		{
			await _manager.FormService
				.CreateRentingFormAsync(languageParams, formDto, HttpContext);

			return NoContent();
		}


		[HttpGet("display/oneUser/all")]
		public async Task<IActionResult> GetAllFormsOfOneUser(
			[FromQuery] FormParamsForGetAllFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetAllFormTypesOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}

		[HttpGet("display/oneUser/generalCommunication")]
		public async Task<IActionResult> GetGeneralCommFormsOfOneUser(
			[FromQuery] FormParamsForGetGeneralCommFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetGeneralCommFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}

		[HttpGet("display/oneUser/getOffer")]
		public async Task<IActionResult> GetGetOfferFormsOfOneUser(
			[FromQuery] FormParamsForGetGetOfferFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetGetOfferFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}

		[HttpGet("display/oneUser/renting")]
		public async Task<IActionResult> GetRentingFormsOfOneUser(
			[FromQuery] FormParamsForGetRentingFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetRentingFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}
	}
}
