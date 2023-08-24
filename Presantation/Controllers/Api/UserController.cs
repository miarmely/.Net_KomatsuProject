using Entities.ViewModels;
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
		public async Task<IActionResult> LoginAsync(UserView viewModel)
		{
			var entity = await _manager.UserService
				.LoginAsync(viewModel);

			return Ok(entity);
		}


		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserView viewModel)
		{
			var entity = await _manager.UserService
				.RegisterAsync(viewModel);

			return StatusCode(StatusCodes.Status201Created, entity);
		}
	}
}