using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Temsa_Web.Controllers
{
	public class UserController : Controller
	{
		private readonly IServiceManager _manager;

		public UserController(IServiceManager manager) =>
			_manager = manager;
       
        public IActionResult Create(
			[FromQuery(Name = "language")] string language)
		{
			ViewBag.Language = language;

			return View("Create", _manager);
		}

		public IActionResult Display(
            [FromQuery(Name = "language")] string language)
		{
            ViewBag.Language = language;

            return View("Display", _manager);
		}
    }
}
