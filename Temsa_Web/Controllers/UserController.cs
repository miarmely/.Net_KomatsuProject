using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;


namespace Temsa_Web.Controllers
{
	[Authorization("Editor,Admin,Editör,Yönetici")]
	public class UserController : Controller
	{
		private readonly IServiceManager _manager;

		public UserController(IServiceManager manager) =>
			_manager = manager;

		public IActionResult Create()
		{
			return View("Create", _manager);
		}

		public IActionResult Display()
		{
			return View("Display", _manager);
		}
	}
}
