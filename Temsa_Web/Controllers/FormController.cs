using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;


namespace Temsa_Web.Controllers
{
	[Authorization("Admin,Editor,Yönetici,Editör")]
	public class FormController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
