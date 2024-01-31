using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;

namespace Temsa_Web.Controllers
{
    [Authorization("Admin,Editor,Yönetici,Editör")]
    public class ProfileOption : Controller
    {
        public IActionResult Profile()
        {
            return View();
        }
    }
}