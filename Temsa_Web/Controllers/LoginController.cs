using Microsoft.AspNetCore.Mvc;

namespace Presantation.Controllers.Web
{
	public class LoginController : Controller
	{
		public IActionResult Index(
			[FromQuery(Name = "language")] string language="TR")
		{
			ViewBag.Language = language;

			return View();
		}
	}
}
