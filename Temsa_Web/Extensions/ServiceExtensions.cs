using Presantation;
using Services.Concretes;
using Services.Contracts;

namespace Temsa_Web.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureLoggerService(this IServiceCollection services) =>
			services.AddSingleton<ILoggerService, LoggerService>();

		public static void ConfigureAddControllersWithView(this IServiceCollection services) =>
			services.AddControllersWithViews()
				.AddApplicationPart(typeof(AssemblyReference).Assembly);
	}
}
