using Entities.QueryModels;
using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	public class UserController : Controller
	{
		public IActionResult Create()
		{
			return View("Create");
		}

		public IActionResult Display([FromQuery] PagingParameters pagingParameters)
		{
			return View("Display", pagingParameters);
		}

		[Route("display/update")]
		public IActionResult Update()
		{
			return View("Update");
		}

		[Route("display/delete")]
		public IActionResult Delete()
		{
			return View("Delete");
		}
	}
}
