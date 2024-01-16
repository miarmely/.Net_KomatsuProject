using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;


namespace Temsa_Web.Controllers
{
	[Authorization("Admin,Editor,Yönetici,Editör")]
	public class FormController : Controller
	{
		public IActionResult GeneralCommunication()
		{
			return View();
		}

		public IActionResult GetOffer()
		{
			return View();
		}

		public IActionResult Renting()
		{
			return View();
		}
	}
}
