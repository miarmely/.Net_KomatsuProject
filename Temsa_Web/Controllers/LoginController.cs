using Microsoft.AspNetCore.Mvc;

namespace Presantation.Controllers.Web
{
	public class LoginController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
