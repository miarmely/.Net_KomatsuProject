using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Areas.Admin.Controllers
{
	[Area("Admin")]
	public class UserController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
