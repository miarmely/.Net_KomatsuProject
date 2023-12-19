using Entities.DtoModels.FormDtos;
using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;


namespace Presantation.Controllers
{
    [ApiController]
    [Route("api/services/[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IServiceManager _manager;
        
        public UserController(IServiceManager services) =>
            _manager = services;
       
        [HttpPost("login/mobile")]
        [ValidationUserFormat]
        public async Task<IActionResult> LoginForMobileAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginForMobileAsync(language, userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("login/web")]
        [ValidationUserFormat]
        public async Task<IActionResult> LoginForWebAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginForWebAsync(language, userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("register")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> RegisterAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] UserDtoForRegister userDto)
        {
            await _manager.UserService
                .RegisterAsync(language, userDto);

            return StatusCode(StatusCodes.Status201Created);
        }


        [HttpPost("create")]
        [Authorization("Editor,Admin,Editör,Yönetici")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> CreateUserAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] UserDtoForCreate userDto)
		{
            await _manager.UserService
                .CreateUserAsync(language, userDto);

			return StatusCode(StatusCodes.Status201Created);
		}

        
        [HttpPost("create/form/generalCommunication")]
		[Authorization("User,Kullanıcı")]
        public async Task<IActionResult> CreateGeneralCommunicationForm(
            [FromBody] GeneralCommFormDtoForCreate formDto)
        {
            await _manager.UserService
                .CreateGenaralCommFormAsync(formDto, HttpContext);

            return NoContent();
        }

		[HttpPost("create/form/getOffer")]
		[Authorization("User,Kullanıcı")]
		public async Task<IActionResult> CreateGetOfferForm(
            [FromQuery] LanguageParams languageParams,
            [FromBody] GetOfferFormDtoForCreate formDto)
		{
			await _manager.UserService
				.CreateGetOfferFormAsync(languageParams, formDto, HttpContext);

			return NoContent();
		}

		[HttpPost("create/form/renting")]
		[Authorization("User,Kullanıcı")]
		public async Task<IActionResult> CreateRentingForm(
			[FromQuery] LanguageParams languageParams,
			[FromBody] RentingFormDtoForCreate formDto)
		{
			await _manager.UserService
				.CreateRentingFormAsync(languageParams, formDto, HttpContext);

			return NoContent();
		}


		[HttpGet("display/all")]
        [Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery] LanguageAndPagingParams queryParams)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(queryParams, Response);

            return Ok(entity);
        }


        [HttpGet("display/role")]
        public async Task<IActionResult> GetAllRolesByLanguage(
            [FromQuery(Name = "language")][Required] string language)
        {
            var roles = await _manager.UserService
                .GetAllRolesByLanguageAsync(language);

            return Ok(roles);
        }


        [HttpGet("display/form/oneUser/all")]
        public async Task<IActionResult> GetAllFormsOfOneUser(
            [FromQuery] FormParamsForGetAllFormsOfOneUser formParams)
        {
            var allForms = await _manager.UserService
                .GetAllFormsOfOneUserAsync(formParams);

            return Ok(allForms);
        }


        [HttpPut("update")]
        [Authorization("Admin,Yönetici")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> UpdateUserByTelNoAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromQuery(Name = "telNo")][Required] string telNo,
            [FromBody] UserDtoForUpdate userDto)
        {
            await _manager.UserService
                .UpdateUserByTelNoAsync(language, telNo, userDto);

            return NoContent();
        }


        [HttpDelete("delete")]
        [Authorization("Admin,Yönetici")]
        [ValidationNullArguments]
        public async Task<IActionResult> DeleteUsersAsync(
            [FromQuery(Name = "language")][Required] string language,
            [FromBody] UserDtoForDelete userDto)
        {
            await _manager.UserService
                .DeleteUsersByTelNoListAsync(language, userDto);

            return NoContent();
        }
    }
}