using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;

namespace Temsa_Web.Controllers
{
    [Authorization("Admin,Editor,Yönetici,Editör")]
    public class SettingsController : Controller
    {
        public IActionResult Sliders()
        {
            return View();
        }
    }
}
