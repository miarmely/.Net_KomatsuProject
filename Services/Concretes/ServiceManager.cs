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
		private readonly Lazy<ISliderService> _sliderService;
		
		public IUserService UserService => _userService.Value;
		public IMailService MailService => _mailService.Value;
		public IMachineService MachineService => _machineService.Value;
		public IFileService FileService => _fileService.Value;
		public ISliderService SliderService => _sliderService.Value;
       
		public ServiceManager(IRepositoryManager manager,
			IConfigManager configs,
			IMapper mapper)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(manager, configs, mapper));
			_mailService = new Lazy<IMailService>(() =>
				new MailService(configs));
			_machineService = new Lazy<IMachineService>(() => 
				new MachineService(manager, FileService));
			_fileService = new Lazy<IFileService>(() => 
				new FileService(configs));
			_sliderService = new Lazy<ISliderService>(() => 
				new SliderService(manager, configs, FileService));
        }
	}
}
