using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Entities.ConfigModels.Contracts;
using Presantation.Attributes;
using System.Reflection.Metadata.Ecma335;

namespace Temsa_Web.Controllers
{
	public class AuthenticationController : Controller
	{
		private readonly IConfigManager _configs;

        public AuthenticationController(IConfigManager configs) =>   
            _configs = configs;
        
        public IActionResult Login()
        {
            return View("Login");
        }
			
		public async Task<IActionResult> AfterLogin(
            [FromQuery(Name = "token")] string token)
		{
			#region when token invalid
			if (await IsTokenInvalidAsync(token))
				return RedirectToAction(
					"Login",
					"Authentication");
            #endregion

            #region set claimsIdentity
            var jwtTokenClaims = new JwtSecurityToken(token)
                  .Claims;

            var claimsIdentity = new ClaimsIdentity(
				jwtTokenClaims,
				CookieAuthenticationDefaults.AuthenticationScheme);
			#endregion

			#region sign in
			await HttpContext.SignInAsync(
				CookieAuthenticationDefaults.AuthenticationScheme,
				new ClaimsPrincipal(claimsIdentity));
			#endregion
			
            return RedirectToAction("display", "machine");
		}


		[Authorization("Editor,Admin,Editör,Yönetici")]
		public async Task<IActionResult> Logout()
		{
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

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

        #endregion
    }
}
