using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Entities.DataModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Presantation;
using Presantation.ActionFilters.Attributes;
using Repositories.Concretes;
using Repositories.Contracts;
using Repositories.EF;
using Services.Concretes;
using Services.Contracts;
using System.Text;

namespace Temsa.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureRepositoryContext(this IServiceCollection services
			, IConfiguration configuration) =>
				services.AddDbContext<RepositoryContext>(options =>
					options.UseSqlServer(configuration
						.GetConnectionString("SqlServer")));

		public static void ConfigureAllManagers(this IServiceCollection services)
		{
			services.AddScoped<IRepositoryManager, RepositoryManager>();
			services.AddScoped<IServiceManager, ServiceManager>();
			services.AddScoped<IConfigManager, ConfigManager>();
		}

		public static void ConfigureLoggerService(this IServiceCollection services) =>
			services.AddSingleton<ILoggerService, LoggerService>();

		public static void ConfigureActionFilters(this IServiceCollection services)
		{
			services.AddSingleton<LogFilter>();
			services.AddScoped<ErrorFilter>();
			services.AddScoped<ValidationUserFormatFilter>();
		}

		public static void ConfigureConfigModels(this IServiceCollection services
			, IConfiguration configuration)
		{
			services.Configure<UserSettingsConfig>(configuration
				.GetSection(nameof(UserSettingsConfig)));

			services.Configure<JwtSettingsConfig>(configuration
				.GetSection(nameof(JwtSettingsConfig)));

			services.Configure<MailSettingsConfig>(configuration
				.GetSection(nameof(MailSettingsConfig)));
		}
				
		public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
		{
			var section = configuration.GetSection("JwtSettingsConfig");

			services.AddAuthentication(opt =>
			{
				opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(opt =>
			{
				#region set issuerSigningKey
				var issuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
					.GetBytes(section["SecretKey"]));
				#endregion

				opt.TokenValidationParameters = new TokenValidationParameters
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

		public static void ConfigureAddControllersWithView(this IServiceCollection service)
			=> service.AddControllersWithViews()
				.AddApplicationPart(typeof(AssemblyReference).Assembly);
	}
}
