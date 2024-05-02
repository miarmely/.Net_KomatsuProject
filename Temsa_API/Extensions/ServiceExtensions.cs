using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Entities.MiarLibrary.ConfigModels;
using Miarmely.Services.Concretes;
using Miarmely.Services.Contracts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Presantation;
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
			services.AddSingleton<RepositoryContext>();
			services.AddScoped<IMiarService, MiarService>();
		}

		public static void ConfigureConfigModels(
			this IServiceCollection services,
			IConfiguration configuration)
		{
			services.Configure<JwtSettingsConfig>(configuration
				.GetSection(nameof(JwtSettingsConfig)));

			services.Configure<MailSettingsConfig>(configuration
				.GetSection(nameof(MailSettingsConfig)));

			services.Configure<DbSettingsConfig>(configuration
				.GetSection(nameof(DbSettingsConfig)));

			services.Configure<LoginSettingsConfig>(configuration
				.GetSection(nameof(LoginSettingsConfig)));

			services.Configure<ErrorDetailsConfig>(configuration
				.GetSection(nameof(ErrorDetailsConfig)));

			services.Configure<OTPSettingsConfig>(configuration
				.GetSection(nameof(OTPSettingsConfig)));
		}

		public static void ConfigureJwt(
			this IServiceCollection services,
			IConfiguration configuration) =>
			services
				.AddAuthentication(opt =>
				{
					opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(opt =>
				{
					#region set issuerSigningKey
					var section = configuration.GetSection(nameof(JwtSettingsConfig));

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

		public static void ConfigureAddControllers(this IServiceCollection service)
			=> service
				.AddControllers()
				.AddApplicationPart(typeof(AssemblyReference).Assembly);

		public static void ConfigureCORS(this IServiceCollection services) =>
			services.AddCors(setup =>
			{
				#region for Temsa_Web projects
				setup.AddDefaultPolicy(configure =>
					configure
						.WithOrigins(
							"http://localhost:7136",
							"https://localhost:7136",
							"http://104.247.163.183:5552",
							"https://104.247.163.183:5552",
							"http://192.168.200.1:5552",
							"https://192.168.200.1:5552")
						.AllowAnyMethod()
						.AllowAnyHeader()
						.WithExposedHeaders(
							"User-Pagination",
							"Machine-Pagination",
							"Form-Gc-Answered",  // Gc: General Communication
							"Form-Gc-Unanswered",
							"Form-Gc-All",
							"Form-Go-Waiting",  // Go: Get Offer
							"Form-Go-Accepted",
							"Form-Go-Rejected",
							"Form-R-Waiting",  // R: Renting
							"Form-R-Accepted",
							"Form-R-Rejected"));
				#endregion
			});
	}
}