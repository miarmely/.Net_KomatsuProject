using AutoMapper;
using Entities.ConfigModels.Contracts;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class ServiceManager : IServiceManager
    {
		#region fields
		private readonly Lazy<IUserService> _userService;
		private readonly Lazy<ICompanyService> _companyService;
		private readonly Lazy<IMailService> _mailService;
		private readonly Lazy<IMachineService> _machineService;
		#endregion

		#region properties
		public IUserService UserService => _userService.Value;
		public ICompanyService CompanyService => _companyService.Value;
		public IMailService MailService => _mailService.Value;
		public IMachineService MachineService => _machineService.Value;
		#endregion

		#region functions
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
			_machineService = new Lazy<IMachineService>(() => 
				new MachineService(repository));
        }
		#endregion
	}
}
