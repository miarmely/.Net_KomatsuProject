using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
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
       

		//public static void ConfigureJwt(
		//	this IServiceCollection services,
		//	IConfiguration configuration) =>
		//		services.AddAuthentication(config =>
		//		{
		//			config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		//			config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		//		})
		//		.AddJwtBearer(config =>
		//	{
		//		#region set issuerSigningKey
		//		var section = configuration.GetSection(nameof(JwtSettingsConfig));

		//		var issuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
		//			.GetBytes(section["SecretKey"]));
		//		#endregion

		//		config.TokenValidationParameters = new TokenValidationParameters
		//		{
		//			ValidIssuer = section["ValidIssuer"],
		//			ValidateIssuer = true,
		//			ValidAudience = section["ValidAudience"],
		//			ValidateAudience = true,
		//			IssuerSigningKey = issuerSigningKey,
		//			ValidateIssuerSigningKey = true,
		//			ValidateLifetime = true
		//		};
		//	});
	}
}
