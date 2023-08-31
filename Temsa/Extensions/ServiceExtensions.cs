using Entities.ConfigModels;
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

		public static void ConfigureRepositoryManager(this IServiceCollection services) =>
			services.AddScoped<IRepositoryManager, RepositoryManager>();
		
		public static void ConfigureServiceManager(this IServiceCollection services) =>
			services.AddScoped<IServiceManager, ServiceManager>();

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
		}
				
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
