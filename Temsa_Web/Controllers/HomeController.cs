using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	public class HomeController : Controller
	{
		public IActionResult Index(
			[FromQuery(Name = "language")] string language,
			[FromQuery(Name = "token")] string token = null)
		{
			ViewBag.Language = language;

			return View();
		}
	}
}
