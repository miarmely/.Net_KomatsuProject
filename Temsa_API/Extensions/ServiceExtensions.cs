using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Presantation;
using Presantation.ActionFilters.Attributes;
using Presantation.ActionFilters.Filters;
using Repositories;
using Repositories.Concretes;
using Repositories.Contracts;
using Services.Concretes;
using Services.Contracts;
using System.Text;

namespace Temsa_Api.Extensions
{
    public static class ServiceExtensions
	{		
		public static void ConfigureAllManagers(this IServiceCollection services)
		{
			services.AddScoped<IRepositoryManager, RepositoryManager>();
			services.AddScoped<IServiceManager, ServiceManager>();
			services.AddScoped<IConfigManager, ConfigManager>();
		}
	
		public static void ConfigureServices(this IServiceCollection services)
		{
            services.AddSingleton<ILoggerService, LoggerService>();
			services.AddSingleton<RepositoryContext>();
        }

		public static void ConfigureActionFilters(this IServiceCollection services)
		{
			services.AddScoped<ErrorFilter>();
			services.AddScoped<ValidationUserFormatFilter>();
			services.AddScoped<ValidationNullArgumentsFilter>();
			//services.AddScoped<AuthorizationFilter>();
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

			services.Configure<FileServiceSettingsConfig>(configuration
				.GetSection(nameof(FileServiceSettingsConfig)));

			services.Configure<DbSettingsConfig>(configuration
				.GetSection(nameof(DbSettingsConfig)));

			services.Configure<MainRolesConfig>(configuration
				.GetSection(nameof(MainRolesConfig)));
		}
				
		public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
		{
			var section = configuration.GetSection(nameof(JwtSettingsConfig));

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

		public static void ConfigureAddControllers(this IServiceCollection service)
			=> service.AddControllers()
				.AddApplicationPart(typeof(AssemblyReference).Assembly);

		public static void ConfigureCORS(this IServiceCollection services) =>
			services.AddCors(setup =>
			{
				#region for Temsa_Web projects
				setup.AddPolicy("Temsa_Web", configure => 
					configure
						.WithOrigins(
							"https://localhost:7091", 
							"https://localhost:7136",
							"http://127.0.0.1:5500")
						.AllowAnyHeader()
						.AllowAnyMethod()
						.WithExposedHeaders(
							"User-Pagination",
							"Machine-Pagination"));
				#endregion
			});
	}
}
