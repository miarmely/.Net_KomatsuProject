using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Temsa_Web.Areas.Admin.Controllers
{
	[Area("Admin")]
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
		
			
			return View();
		}
	}
}
