using AutoMapper;
using Entities.ConfigModels.Contracts;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class ServiceManager : IServiceManager
    {
		private readonly Lazy<IUserService> _userService;
		private readonly Lazy<IMailService> _mailService;
		private readonly Lazy<IMachineService> _machineService;
		private readonly Lazy<IFileService> _fileService;
		
		public IUserService UserService => _userService.Value;
		public IMailService MailService => _mailService.Value;
		public IMachineService MachineService => _machineService.Value;
		public IFileService FileService => _fileService.Value;
       
		public ServiceManager(IRepositoryManager manager,
			IConfigManager config,
			IMapper mapper)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(manager, config, mapper));
			_mailService = new Lazy<IMailService>(() =>
				new MailService(config));
			_machineService = new Lazy<IMachineService>(() => 
				new MachineService(manager));
			_fileService = new Lazy<IFileService>(() => 
				new FileService(config));
        }
	}
}
