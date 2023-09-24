using Entities.DtoModels.UserDtos;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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


        //[HttpPost("login")]
        //[ValidationUserFormat]
        //public async Task<IActionResult> LoginAsync(UserBodyDtoForLogin userDto)
        //{
        //    var token = await _manager.UserService
        //        .LoginAsync(userDto);

        //    return Ok(new
        //    {
        //        Token = token
        //    });
        //}


		[HttpPost("create")]
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
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery] PaginationParameters pagingParameters)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(pagingParameters, Response);

            return Ok(entity);
        }


        [HttpPut("update/{telNo}")]
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