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


		[HttpGet("display/all")]
		[Authorization]
		public async Task<IActionResult> GetAllFormsOfOneUser(
			[FromQuery] FormParamsForGetAllFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetAllFormTypesOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}


		[HttpGet("display/generalCommunication/oneUser")]
		[Authorization]
		public async Task<IActionResult> GetGeneralCommFormsOfOneUser(
			[FromQuery] FormParamsForGetGeneralCommFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetGeneralCommFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}


		[HttpGet("display/getOffer/oneUser")]
		[Authorization]
		public async Task<IActionResult> GetGetOfferFormsOfOneUser(
			[FromQuery] FormParamsForGetGetOfferFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetGetOfferFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}


		[HttpGet("display/renting/oneUser")]
		[Authorization]
		public async Task<IActionResult> GetRentingFormsOfOneUser(
			[FromQuery] FormParamsForGetRentingFormsOfOneUser formParams)
		{
			var allForms = await _manager.FormService
				.GetRentingFormsOfOneUserAsync(formParams, HttpContext);

			return Ok(allForms);
		}


		[HttpGet("display/generalCommunication/")]
		//[Authorization]
		public async Task<IActionResult> GetAllGeneralCommForms(
			[FromQuery] FormParamsForGetAllGeneralCommForms formParams)
		{
			var formViews = await _manager.FormService
				.GetAllGeneralCommFormsAsync(formParams);

			return Ok(formViews);
		}


		[HttpGet("answer/generalCommunication")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> AnswerTheGeneralCommForm(
			[FromQuery] FormParamsForAnswer formParams)
		{
            var answererInfos = await _manager.FormService.AnswerFormAsync(
                formParams,
                Entities.Enums.FormTypes.GeneralCommunication,
                HttpContext);

            return Ok(answererInfos);
		}


        [HttpGet("answer/getOffer")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> AnswerTheGetOfferForm(
        [FromQuery] FormParamsForAnswer formParams)
        {
            await _manager.FormService.AnswerFormAsync(
                formParams,
                Entities.Enums.FormTypes.GetOffer,
                HttpContext);

            return NoContent();
        }


        [HttpGet("answer/renting")]
        [Authorization("Admin,Editor,Yönetici,Editör")]
        public async Task<IActionResult> AnswerTheRentingForm(
        [FromQuery] FormParamsForAnswer formParams)
        {
			await _manager.FormService.AnswerFormAsync(
				formParams,
				Entities.Enums.FormTypes.Renting,
				HttpContext);

            return NoContent();
        }
    }
}
