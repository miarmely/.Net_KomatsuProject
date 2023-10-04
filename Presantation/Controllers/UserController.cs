using Entities.DtoModels.UserDtos;
using Entities.QueryModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Presantation.ActionFilters;
using Services.Contracts;


namespace Presantation.Controllers
{
    [ApiController]
    [Route("api/services/[Controller]")]
    [ModifyError]

    public class UserController : ControllerBase
    {
        private readonly IServiceManager _manager;
        
        public UserController(IServiceManager services) =>
            _manager = services;
            

        [HttpPost("login")]
        [ValidationUserFormat]
        public async Task<IActionResult> LoginAsync(UserDtoForLogin userDto)
        {
            var token = await _manager.UserService
                .LoginAsync(userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("register")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> RegisterAsync(
            [FromBody] UserDtoForRegister userDto)
        {
            await _manager.UserService
                .RegisterAsync(userDto);

            return StatusCode(StatusCodes.Status201Created);
        }


        [HttpPost("create")]
        //[Authorization("Editor,Admin,Editör,Yönetici")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> CreateUserAsync(
            [FromBody] UserDtoForCreate userDto)
		{
            await _manager.UserService
                .CreateUserAsync(userDto);

			return StatusCode(StatusCodes.Status201Created);
		}


        [HttpGet("display")]
        //[Authorization("Admin,Editor,User,Yönetici,Editör,Kullanıcı")]
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery] string language,
            [FromQuery] PaginationParameters pagingParameters)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(pagingParameters, language, Response);

            return Ok(entity);
        }


        [HttpPut("update/{telNo}")]
        //[Authorization("Admin,Editor,Yönetici,Editör")]
        [ValidationUserFormat]
        [ValidationNullArguments]
        public async Task<IActionResult> UpdateUserByTelNoAsync(
            [FromRoute(Name = "telNo")] string telNo,
            [FromBody] UserDtoForUpdate userDto)
        {
            await _manager.UserService
                .UpdateUserByTelNoAsync(telNo, userDto);

            return NoContent();
        }


        [HttpDelete("delete")]
        //[Authorization("Admin,Yönetici")]
        [ValidationNullArguments]
        public async Task<IActionResult> DeleteUsersAsync(
            [FromBody] UserDtoForDelete userDto)
        {
            await _manager.UserService
                .DeleteUsersByTelNoListAsync(userDto);

            return NoContent();
        }
    }
}