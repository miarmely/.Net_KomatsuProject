using Entities.ConfigModels;
<<<<<<< Updated upstream
=======
using Entities.DataModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
>>>>>>> Stashed changes
using Microsoft.EntityFrameworkCore;
using Repositories.Concretes;
using Repositories.Contracts;
using Repositories.EF;
using Services.Concretes;
using Services.Contracts;

namespace Temsa.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureRepositoryContext(this IServiceCollection services
			, IConfiguration configuration) =>
				services.AddDbContext<RepositoryContext>(options =>
					options.UseSqlServer(configuration
						.GetConnectionString("SqlServer")));

		public static void ConfigureRepositoryManager(this IServiceCollection services) =>
			services.AddScoped<IRepositoryManager, RepositoryManager>();
		
		public static void ConfigureServiceManager(this IServiceCollection services) =>
			services.AddScoped<IServiceManager, ServiceManager>();

		public static void ConfigureLoggerService(this IServiceCollection services) =>
			services.AddSingleton<ILoggerService, LoggerService>();
<<<<<<< Updated upstream
=======

		public static void ConfigureActionFilters(this IServiceCollection services)
		{
			services.AddSingleton<LogFilter>();
			services.AddSingleton<ErrorFilter>();
			services.AddScoped<ValidationUserFormatFilter>();
		}

		public static void ConfigureUserSettings(this IServiceCollection services
			, IConfiguration configuration) =>
				services.Configure<UserSettingsConfig>(configuration
					.GetSection(nameof(UserSettingsConfig)));

		public static void ConfigureIdentity(this IServiceCollection services)
		{
			services.AddIdentity<UserWithIdentity, IdentityRole>(setup =>
			{
				setup.Password.RequireDigit = true;
				setup.Password.RequiredLength = 6;
				setup.Password.RequireNonAlphanumeric = false;
				setup.Password.RequireUppercase = false;
				setup.Password.RequireLowercase = false;

				setup.User.RequireUniqueEmail = true;
			})
			.AddEntityFrameworkStores<RepositoryContext>()
			.AddDefaultTokenProviders();
		}
>>>>>>> Stashed changes
	}
}
