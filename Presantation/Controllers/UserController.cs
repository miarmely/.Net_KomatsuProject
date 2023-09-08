using Entities.DtoModels;
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
        private readonly IServiceManager _services;

        public UserController(IServiceManager services) =>
			_services = services;


        [HttpPost("login")]
        [ValidationUserFormat]
        public async Task<IActionResult> LoginAsync(UserDtoForLogin userDto)
        {
            var token = await _services.UserService
                .LoginAsync(userDto);

            return Ok(new
            {
                Token = token
            });
        }


        [HttpPost("registerForMobile")]
        [ValidationUserFormat]
        public async Task<IActionResult> RegisterForMobileAsync(
            [FromBody] UserDtoForRegisterWithoutRole userDto)
        {
            await _services.UserService
                .RegisterAsync(userDto, "User");  // set user role as user

            return StatusCode(StatusCodes.Status201Created, new {});
        }


		[HttpPost("registerForWeb")]
		[ValidationUserFormat]
		public async Task<IActionResult> RegisterForWebAsync(
            [FromBody] UserDtoForRegisterWithRole userDto)
		{
			await _services.UserService
				.RegisterAsync(userDto, userDto.RoleName);

			return StatusCode(StatusCodes.Status201Created, new { });
		}


        [HttpGet("display")]
        public async Task<IActionResult> DisplayUserWithPagingAsync(
            [FromQuery] PagingParameters pagingParameters)
        {
            return Ok();
        }
	}
}