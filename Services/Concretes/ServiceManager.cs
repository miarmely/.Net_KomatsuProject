using AutoMapper;
using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Microsoft.Extensions.Options;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class ServiceManager : IServiceManager
    {
		private readonly Lazy<IUserService> _userService;
		private readonly Lazy<ICompanyService> _companyService;
		private readonly Lazy<IMailService> _mailService;

		public IUserService UserService => _userService.Value;
		public ICompanyService CompanyService => _companyService.Value;
		public IMailService MailService => _mailService.Value;
		
		public ServiceManager(IRepositoryManager repository,
			IConfigManager config,
			IMapper mapper)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(repository, config, mapper));
			_companyService = new Lazy<ICompanyService>(() => 
				new CompanyService(repository));
			_mailService = new Lazy<IMailService>(() =>
				new MailService(config));
        }
	}
}
