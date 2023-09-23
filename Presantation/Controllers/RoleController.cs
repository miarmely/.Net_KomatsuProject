using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presantation.Controllers
{
    [ApiController]
    [Route("api/services/[Controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IServiceManager _manager;

        public RoleController(IServiceManager manager) =>
            _manager = manager;


        //[HttpGet("display")]
        //public async Task<IActionResult> GetAllRolesAsync()
        //{
        //    var roles = await _manager.RoleService
        //        .GetAllRolesAsync();

        //    return Ok(roles);
        //}
    }
}
