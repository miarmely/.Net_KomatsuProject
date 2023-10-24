using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Contracts;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Temsa_Web.Controllers
{
	public class UserController : Controller
	{
		private readonly IServiceManager _manager;
		private readonly IConfigManager _configs;

		public UserController(IServiceManager manager, IConfigManager configs)
		{
			_manager = manager;
			_configs = configs;
		}

		public IActionResult Login(
			[FromQuery(Name = "language")] string language = "TR")
		{
			ViewBag.Language = language;

			return View("Login");
		}

		public async Task<IActionResult> Create(
			[FromQuery(Name = "language")] string language = "TR",
			[FromQuery(Name = "token")] string token = null)
		{
			ViewBag.Language = language;

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

			return View("Create", _manager);
		}

		public async Task<IActionResult> Display(
			[FromQuery(Name = "language")] string language = "TR",
			[FromQuery(Name = "token")] string token = null)
		{
			ViewBag.Language = language;

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

			return View("Display", _manager);
		}


		#region private

		private async Task<bool> IsTokenInvalidAsync(string token)
		{
			#region validate token
			var tokenHandler = new JwtSecurityTokenHandler();
			var securityKeyInBytes = Encoding.UTF8.GetBytes(_configs
				.JwtSettings
				.SecretKey);

			var result = await tokenHandler.ValidateTokenAsync(token,
				new TokenValidationParameters
				{
					ValidAudience = _configs.JwtSettings.ValidAudience,
					ValidateAudience = true,
					ValidIssuer = _configs.JwtSettings.ValidIssuer,
					ValidateIssuer = true,
					IssuerSigningKey = new SymmetricSecurityKey(securityKeyInBytes),
					ValidateIssuerSigningKey = true,
					ValidateLifetime = true,
					RequireExpirationTime = true,
				});
			#endregion

			#region when token is invalid
			if (!result.IsValid)
				return true;
			#endregion

			return false;
		}

		private async Task<bool> IsTokenExpiredAsync(string expires) =>
			await Task.Run(() =>
			{
				#region control expires
				var expiresInUnixTime = long.Parse(expires);
				var expiresInDateTime = DateTimeOffset
					.FromUnixTimeSeconds(expiresInUnixTime);

				// when token is expired
				if (expiresInDateTime < DateTime.UtcNow)
					return true;
				#endregion

				return false;
			});

		#endregion
	}
}
