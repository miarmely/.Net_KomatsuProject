using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
    public class SettingsController : Controller
    {
        public IActionResult Sliders()
        {
            return View();
        }
    }
}
