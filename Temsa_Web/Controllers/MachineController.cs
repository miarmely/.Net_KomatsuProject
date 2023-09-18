using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Temsa_Web.Controllers
{
	public class MachineController : Controller
	{
		private readonly IConfigManager _configManager;

        public MachineController(IConfigManager configManager) =>
            _configManager = configManager;
        
        public IActionResult Create()
		{
			return View("Create", _configManager);
		}

		public IActionResult Display()
		{
			return View("Display", _configManager);
		}
	}
}
