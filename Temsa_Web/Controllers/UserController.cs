using Microsoft.AspNetCore.Mvc;
using Presantation.ActionFilters;
using Services.Contracts;


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
			return View("Create", _manager);
		}

		public async Task<IActionResult> Display()
		{
			return View("Display", _manager);
		}


		/*
			#region protect endpoint

			#region control whether url without token entered without login
			if (token == null)
			{
				#region get expires claim from HttpContext
				var expiresClaim = Request.HttpContext.User.Claims
					.FirstOrDefault(c => c.Type.Equals("exp"));
				#endregion

				#region when url entered without login or token expired 
				if (expiresClaim == null
					|| await IsTokenExpiredAsync(expiresClaim.Value))
					return RedirectToAction("Login", new { language });
				#endregion
			}
			#endregion

			#region control whether url with token entered without login
			else
			{
				#region when token invalid
				if (await IsTokenInvalidAsync(token))
					return RedirectToAction("Login", new { language });

				#endregion

				#region get expires in token
				var expires = new JwtSecurityToken(token)
					.Claims
					.First(c => c.Type.Equals("exp"))
					.Value;
				#endregion

				#region when token expired
				if (await IsTokenExpiredAsync(expires))
					return RedirectToAction("Login", new { language });

				// when logged but page closed then page opened again
				#endregion
			}
			#endregion

			#endregion
			*/
	}
}
