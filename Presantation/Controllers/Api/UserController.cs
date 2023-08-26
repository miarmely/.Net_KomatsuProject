using Entities.DtoModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presantation.Controllers.Api
{
	[ApiController]
	[Route("api/services/[Controller]")]
	public class UserController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public UserController(IServiceManager manager) =>
			_manager = manager;


		[HttpPost("login")]
		public async Task<IActionResult> LoginAsync(UserDtoForLogin userDto)
		{
			var entity = await _manager.UserService
				.LoginAsync(userDto);

			return Ok(entity);
		}


		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserDtoForRegister userDto)
		{
			var entity = await _manager.UserService
				.RegisterAsync(userDto);

			return StatusCode(StatusCodes.Status201Created, entity);
		}
	}
}