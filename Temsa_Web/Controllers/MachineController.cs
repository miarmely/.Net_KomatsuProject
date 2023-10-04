using Entities.ConfigModels.Contracts;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Temsa_Web.Controllers
{
	public class MachineController : Controller
	{
		private readonly IConfigManager _configManager;
		private readonly IServiceManager _manager;

		public MachineController(IConfigManager configManager,
			IServiceManager manager)
		{
			_configManager = configManager;
			_manager = manager;
		}

		public IActionResult Create(
			[FromQuery(Name = "Language")] string language)
		{
			ViewBag.Language = language;

			return View("Create", _manager);
		}

		public IActionResult Display(
			[FromQuery(Name = "Language")] string language,
			[FromQuery] PaginationParameters pagingParameters)
		{
			ViewBag.Language = language;
			ViewBag.Response = Response;
			ViewBag.pagingParameters = pagingParameters;

			return View("Display", _manager);
		}
	}
}
