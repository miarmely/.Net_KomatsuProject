using Microsoft.AspNetCore.Mvc;

namespace Presantation.Controllers.Web
{
	public class LoginController : Controller
	{
		public IActionResult Index()
		{
			// set login default language as TR
			ViewBag.Language = "TR";

			return View();
		}
	}
}
