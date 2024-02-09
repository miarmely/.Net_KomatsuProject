using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using System.Net;

namespace Temsa_Web.Controllers
{
	[Authorization("Editor,Admin,Editör,Yönetici")]
	public class SliderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
