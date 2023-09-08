using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	[Route("user")]
	public class UserController : Controller
	{
		[Route("create")]
		public IActionResult CreateUser()
		{
			return View("Create");
		}

		[Route("display")]
		public IActionResult DisplayUser()
		{
			return View("Display");
		}

		[Route("update")]
		public IActionResult UpdateUser()
		{
			return View("Update");
		}

		[Route("delete")]
		public IActionResult DeleteUser()
		{
			return View("Delete");
		}
	}
}
