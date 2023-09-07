using Entities.ConfigModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Presantation;
using Services.Concretes;
using Services.Contracts;
using System.Text;

namespace Temsa_Web.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureLoggerService(this IServiceCollection services) =>
			services.AddSingleton<ILoggerService, LoggerService>();

		public static void ConfigureAddControllersWithView(this IServiceCollection services) =>
			services.AddControllersWithViews()
				.AddApplicationPart(typeof(AssemblyReference).Assembly);

		public static void ConfigureConfigModels(this IServiceCollection services) =>
			services.AddScoped<JwtSettingsConfig>();

		public static void ConfigureJwt(this IServiceCollection services,
			IConfiguration configuration) =>
			services.AddAuthentication(config =>
			{
				config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(config =>
			{
				#region set issuerSigningKey
				var section = configuration.GetSection(nameof(JwtSettingsConfig));

				var issuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
					.GetBytes(section["SecretKey"]));
				#endregion

				config.TokenValidationParameters = new TokenValidationParameters
				{
					ValidIssuer = section["ValidIssuer"],
					ValidateIssuer = true,
					ValidAudience = section["ValidAudience"],
					ValidateAudience = true,
					IssuerSigningKey = issuerSigningKey,
					ValidateIssuerSigningKey = true,
					ValidateLifetime = true
				};
			});
	}
}
