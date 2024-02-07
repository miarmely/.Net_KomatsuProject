using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using System.Security.Claims;

namespace Temsa_Web.Controllers
{
	[Authorization("Editor,Admin,Editör,Yönetici")]
	public class UserController : Controller
	{
		public IActionResult Create()
		{
            return View();
		}

		public IActionResult Display()
		{
			var userRole = HttpContext.User.Claims
				.FirstOrDefault(c => c.Type.Equals(ClaimTypes.Role))
				.Value;

			return View("Display", userRole);
		}
	}
}
