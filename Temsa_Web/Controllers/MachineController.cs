using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;


namespace Temsa_Web.Controllers
{
	//[Authorization("Editor,Admin,Editör,Yönetici")]
	public class MachineController : Controller
	{
		public IActionResult Create() => View();
		public IActionResult Display() => View("Display", HttpContext.User.Claims);
		public IActionResult Category() => View();
	}
}