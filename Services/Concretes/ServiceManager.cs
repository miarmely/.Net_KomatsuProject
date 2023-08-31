using AutoMapper;
using Entities.ConfigModels;
using Microsoft.Extensions.Options;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class ServiceManager : IServiceManager
    {
		private readonly Lazy<IUserService> _userService;
		private readonly Lazy<ICompanyService> _companyService;

		public IUserService UserService => _userService.Value;
		public ICompanyService CompanyService => _companyService.Value;
		
		public ServiceManager(IRepositoryManager manager
			, IMapper mapper
			, IOptions<JwtSettingsConfig> jwtSettings)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(manager, mapper, jwtSettings));
			_companyService = new Lazy<ICompanyService>(() => 
				new CompanyService(manager));
        }
	}
}
