using Microsoft.EntityFrameworkCore;
using Repositories.EF;

namespace Temsa.Extensions
{
	public static class ServiceExtensions
	{
		public static void ConfigureRepositoryContext(this IServiceCollection services
			, IConfiguration configuration) =>
			services.AddDbContext<RepositoryContext>(options =>
				options.UseSqlServer(configuration
					.GetConnectionString("SqlServer")));
	}
}
