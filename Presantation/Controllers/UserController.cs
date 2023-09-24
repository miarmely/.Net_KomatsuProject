using Entities.DtoModels.QueryModels;
using Entities.DtoModels.UserDtos;
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


        //[HttpPost("register")]
        //[ValidationUserFormat]
        //public async Task<IActionResult> RegisterAsync(
        //    [FromBody] UserBodyDtoForRegister userDtoR)
        //{
        //    await _manager.UserService
        //        .RegisterAsync(userDtoR);

        //    return StatusCode(StatusCodes.Status201Created);
        //}


		[HttpPost("create")]
		[ValidationUserFormat]
		public async Task<IActionResult> CreateUserAsync(
            [FromBody] UserDtoForCreate userDto)
		{
            await _manager.UserService
                .CreateUserAsync(userDto);

			return StatusCode(StatusCodes.Status201Created);
		}


        [HttpGet("display")]
        public async Task<IActionResult> GetAllUsersWithPaginationAsync(
            [FromQuery] PaginationQueryDto pagingParameters)
        {
            var entity = await _manager.UserService
                .GetAllUsersWithPagingAsync(pagingParameters, Response);

            return Ok(entity);
        }


        //      [HttpPut("update/{email}")]
        //      [ValidationUserFormat]
        //      [ValidationNullArguments]
        //      public async Task<IActionResult> GetUpdateUserAsync(
        //          [FromRoute(Name = "email")] string email,
        //          [FromBody] UserBodyDtoForUpdate userDtoU)
        //      {
        //          await _manager.UserService
        //              .UpdateUserAsync(email, userDtoU);

        //          return NoContent();
        //      }


        //      [HttpDelete("delete")]
        //[ValidationNullArguments]
        //public async Task<IActionResult> DeleteUsersAsync(
        //          [FromBody] UserBodyDtoForDelete userDtoD)
        //      {
        //          await _manager.UserService
        //              .DeleteUsersAsync(userDtoD);

        //          return NoContent();
        //}
    }
}