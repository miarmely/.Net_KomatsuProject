using Entities.DtoModels.UserDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters;
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
            

        [HttpPost("login")]
        [ValidationUserFormat]
        public async Task<IActionResult> LoginAsync(
            [FromQuery(Name = "language")] string language,
            [FromBody] UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginAsync(language, userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("register")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> RegisterAsync(
            [FromQuery(Name = "language")] string language,
            [FromBody] UserDtoForRegister userDto)
        {
            await _manager.UserService
                .RegisterAsync(language, userDto);

            return StatusCode(StatusCodes.Status201Created);
        }


        [HttpPost("create")]
        //[Authorization("Editor,Admin,Editör,Yönetici")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> CreateUserAsync(
            [FromQuery(Name = "language")] string language,
            [FromBody] UserDtoForCreate userDto)
		{
            await _manager.UserService
                .CreateUserAsync(language, userDto);

			return StatusCode(StatusCodes.Status201Created);
		}


        [HttpGet("display/all")]
        //[Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery(Name = "language")] string language,
            [FromQuery] PaginationParameters pagingParameters)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(pagingParameters, language, Response);

            return Ok(entity);
        }


        [HttpGet("display/role")]
        public async Task<IActionResult> GetAllRolesByLanguage(
            [FromQuery(Name = "language")] string language)
        {
            var roles = await _manager.UserService
                .GetAllRolesByLanguageAsync(language);

            return Ok(roles);
        }


        [HttpPut("update")]
        //[Authorization("Admin,Editor,Yönetici,Editör")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> UpdateUserByTelNoAsync(
            [FromQuery(Name = "language")] string language,
            [FromQuery(Name = "telNo")] string telNo,
            [FromBody] UserDtoForUpdate userDto)
        {
            await _manager.UserService
                .UpdateUserByTelNoAsync(language, telNo, userDto);

            return NoContent();
        }


        [HttpDelete("delete")]
        //[Authorization("Admin,Yönetici")]
        [ValidationNullArguments]
        public async Task<IActionResult> DeleteUsersAsync(
            [FromQuery(Name = "language")] string language,
            [FromBody] UserDtoForDelete userDto)
        {
            await _manager.UserService
                .DeleteUsersByTelNoListAsync(language, userDto);

            return NoContent();
        }
    }
}