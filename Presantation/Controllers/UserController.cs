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
    public partial class UserController  // For Mobile + Panel
		: ControllerBase
    {
        private readonly IServiceManager _manager;
        
        public UserController(IServiceManager services) =>
            _manager = services;
       
        [HttpPost("login/mobile")]
        public async Task<IActionResult> LoginForMobile(
            [FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForLogin userDto)
        {
            var response = await _manager.UserService
                .LoginForMobileAsync(languageParams.Language, userDto);

            return Ok(response);
		}


        [HttpPost("login/web")]
        public async Task<IActionResult> LoginForWeb(
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
        public async Task<IActionResult> Register(
			[FromQuery] LanguageParams languageParams,
            [FromBody] UserDtoForRegister userDto)
        {
            await _manager.UserService
                .RegisterAsync(languageParams.Language, userDto);

            return StatusCode(StatusCodes.Status201Created);
        }


		[HttpGet("display/one")]
		[Authorization]
		public async Task<IActionResult> GetUser(
			[FromQuery] UserParamsForUpdate userParams)
		{
			var entity = await _manager.UserService
                .GetUserByTelNoAsync(userParams);

			return Ok(entity);
		}


        [HttpPost("update/mobile")]
        [Authorization]
        public async Task<IActionResult> UpdateUserByTelNo(
            [FromQuery] UserParamsForUpdate userParams,
            [FromBody] UserDtoForUpdateForMobile userDto)
        {
            await _manager.UserService.UpdateUserByTelNoAsync(
                userParams.Language, 
                userParams.TelNo, 
                userDto);

            return NoContent();
        }
    }

	public partial class UserController  // For Only Panel
	{
		[HttpPost("create")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> CreateUser(
			[FromQuery] LanguageParams languageParams,
			[FromBody] UserDtoForCreate userDto)
		{
			await _manager.UserService
				.CreateUserAsync(languageParams.Language, userDto);

			return StatusCode(StatusCodes.Status201Created);
		}


		[HttpGet("display/all")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> GetAllUsersWithPagination(
			[FromQuery] LanguageAndPagingParams queryParams)
		{
			var entity = await _manager.UserService
				.GetAllUsersWithPagingAsync(queryParams, Response);

			return Ok(entity);
		}


		[HttpGet("display/role")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> GetAllRolesByLanguage(
			[FromQuery] LanguageParams languageParams)
		{
			var roles = await _manager.UserService
				.GetAllRolesByLanguageAsync(languageParams.Language);

			return Ok(roles);
		}


		[HttpPost("update/panel")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> UpdateUserByTelNo(
			[FromQuery] UserParamsForUpdate userParams,
			[FromBody] UserDtoForUpdateForPanel userDto)
		{
			await _manager.UserService.UpdateUserByTelNoAsync(
				userParams.Language,
				userParams.TelNo,
				userDto);

			return NoContent();
		}


		[HttpPost("delete")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> DeleteUsers(
			[FromQuery] LanguageParams languageParams,
			[FromBody] UserDtoForDelete userDto)
		{
			await _manager.UserService
				.DeleteUsersByTelNoListAsync(languageParams.Language, userDto);

			return NoContent();
		}
	}
}