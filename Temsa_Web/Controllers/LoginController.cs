using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Entities.ConfigModels.Contracts;

namespace Temsa_Web.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfigManager _configs;

        public LoginController(IConfigManager configs) =>
            _configs = configs;

        public IActionResult Index(
            [FromQuery(Name = "language")] string language = "TR")
        {
            ViewBag.Language = language;
            
            return View();
        }

        public async Task<IActionResult> AfterLogin(
            [FromQuery(Name = "token")] string token,
			[FromQuery(Name = "language")] string language)
        {
            #region when token invalid
            if (await IsTokenInvalidAsync(token))
                return RedirectToAction(
                    "Index",
                    "Login",
                    new { ViewBag.Language });
			#endregion

			#region set claimsIdentity

			#region add language to claims
			// convert enumerable claims to list
			var jwtTokenClaims = new JwtSecurityToken(token)
                  .Claims
                  .ToList();

            // add language
            jwtTokenClaims.Add(new Claim(
                "language",
				language));
			#endregion

			#region set claimsIdentity
			var claimsIdentity = new ClaimsIdentity(
                jwtTokenClaims,
                CookieAuthenticationDefaults.AuthenticationScheme);
			#endregion

			#endregion

			#region sign in
			await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties());
            #endregion

            return RedirectToAction("create", "user");
        }

        public void ChangeLanguageInHttpContext(
            [FromQuery(Name = "language")] string language) =>
                HttpContext.Items.Add("language", language);


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
