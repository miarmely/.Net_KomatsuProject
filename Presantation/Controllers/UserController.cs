using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;


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
        public async Task<IActionResult> LoginForMobileAsync(
            [FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginForMobileAsync(languageParams.Language, userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("login/web")]
        public async Task<IActionResult> LoginForWebAsync(
			[FromQuery] LanguageParams languageParams,
			[FromBody] UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginForWebAsync(languageParams.Language, userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("register")]
		[Authorization]
        public async Task<IActionResult> RegisterAsync(
			[FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForRegister userDto)
        {
            await _manager.UserService
                .RegisterAsync(languageParams.Language, userDto);

            return StatusCode(StatusCodes.Status201Created);
        }


        [HttpPost("create")]
        [Authorization("Editor,Admin,Editör,Yönetici")]
        public async Task<IActionResult> CreateUserAsync(
            [FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForCreate userDto)
		{
            await _manager.UserService
                .CreateUserAsync(languageParams.Language, userDto);

			return StatusCode(StatusCodes.Status201Created);
		}

        
		[HttpGet("display/all")]
        [Authorization]
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery] LanguageAndPagingParams queryParams)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(queryParams, Response);

            return Ok(entity);
        }


        [HttpGet("display/role")]
		[Authorization]
		public async Task<IActionResult> GetAllRolesByLanguage(
            [FromQuery] LanguageParams languageParams)
        {
            var roles = await _manager.UserService
                .GetAllRolesByLanguageAsync(languageParams.Language);

            return Ok(roles);
        }


        [HttpPut("update")]
        [Authorization("Admin,Yönetici")]
        public async Task<IActionResult> UpdateUserByTelNoAsync(
            [FromQuery] UserParamsForUpdate userParams,
            [FromBody] UserDtoForUpdate userDto)
        {
            await _manager.UserService.UpdateUserByTelNoAsync(
                userParams.Language, 
                userParams.TelNo, 
                userDto);

            return NoContent();
        }


        [HttpDelete("delete")]
        [Authorization("Admin,Yönetici")]
        public async Task<IActionResult> DeleteUsersAsync(
            [FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForDelete userDto)
        {
            await _manager.UserService
                .DeleteUsersByTelNoListAsync(languageParams.Language, userDto);

            return NoContent();
        }
    }
}