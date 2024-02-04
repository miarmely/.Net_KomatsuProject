using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;


namespace Temsa_Web.Controllers
{
	[Authorization("Editor,Admin,Editör,Yönetici")]
	public class MachineController : Controller
	{
		public IActionResult Create()
		{
			return View("Create");
		}
		public IActionResult Display()
		{
			return View("Display", HttpContext.User.Claims);
		}
	}
}