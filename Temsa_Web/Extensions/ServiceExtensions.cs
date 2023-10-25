using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Authentication.Cookies;
using Repositories;
using Repositories.Concretes;
using Repositories.Contracts;
using Services.Concretes;
using Services.Contracts;

namespace Temsa_Web.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureAddControllersWithView(
			this IServiceCollection services) =>
				services.AddControllersWithViews();

		public static void ConfigureConfigModels(
			this IServiceCollection services,
			IConfiguration configuration)
		{
			services.Configure<JwtSettingsConfig>(configuration
				.GetSection(nameof(JwtSettingsConfig)));

			services.Configure<DbSettingsConfig>(configuration
				.GetSection(nameof(DbSettingsConfig)));
		}

		public static void ConfigureManagers(this IServiceCollection services)
		{
			services.AddScoped<IServiceManager, ServiceManager>();
			services.AddScoped<IRepositoryManager, RepositoryManager>();
			services.AddScoped<IConfigManager, ConfigManager>();
		}

		public static void ConfigureServices(this IServiceCollection services) =>
			services.AddScoped<RepositoryContext>();

		public static void ConfigureCookie(this IServiceCollection services)
		{
			services
				.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
				.AddCookie(opt =>
				{
					opt.LoginPath = "/user/create";
					opt.LogoutPath = "/user/login";
				});
		}
	}
}
