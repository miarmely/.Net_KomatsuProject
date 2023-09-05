using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
