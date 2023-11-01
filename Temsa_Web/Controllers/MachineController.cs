using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.Security.Claims;

namespace Temsa_Web.Controllers
{
	[Authorization("User,Editor,Admin,Kullanıcı,Editör,Yönetici")]
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

		public async Task<IActionResult> Create(
			[FromQuery(Name = "Language")] string language)
		{
			await PopulateViewBagAsync();

			return View("Create", _manager);
		}

		public async Task<IActionResult> Display()
		{
			await PopulateViewBagAsync();

			return View("Display", _manager);
		}


		#region private

		private async Task PopulateViewBagAsync() =>
			await Task.Run(() =>
			{
				#region add language
				ViewBag.Language = HttpContext.User.Claims
					.First(c => c.Type.Equals("language"))
					.Value;
				#endregion

				#region add firstName
				ViewBag.FirstName = HttpContext.User.Claims
					.First(c => c.Type.Equals(ClaimTypes.Name))
					.Value;
				#endregion

				#region add lastName
				ViewBag.LastName = HttpContext.User.Claims
					.First(c => c.Type.Equals(ClaimTypes.Surname))
					.Value;
				#endregion
			});

		#endregion
	}
}
