using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
using Services.Contracts;
using System.Security.Claims;

namespace Temsa_Web.Controllers
{
	[Authorization("User,Editor,Admin,Kullanıcı,Editör,Yönetici")]
	public class UserController : Controller
	{
		private readonly IServiceManager _manager;

		public UserController(IServiceManager manager) =>
			_manager = manager;

		public async Task<IActionResult> Create()
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
