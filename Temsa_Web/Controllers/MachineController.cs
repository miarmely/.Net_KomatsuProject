using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	public class MachineController : Controller
	{
		public IActionResult Create()
		{
			return View("Create");
		}

		public IActionResult Display()
		{
			return View("Display");
		}
	}
}
