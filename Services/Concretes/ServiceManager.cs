using AutoMapper;
using Entities.ConfigModels.Contracts;
using MicroServices;
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
		private readonly Lazy<IFormService> _formService;
		private readonly Lazy<IMachineCategoryService> _machineCategoryService;
		
		public IUserService UserService => _userService.Value;
		public IMailService MailService => _mailService.Value;
		public IMachineService MachineService => _machineService.Value;
		public IFileService FileService => _fileService.Value;
		public ISliderService SliderService => _sliderService.Value;
		public IFormService FormService => _formService.Value;
		public IMachineCategoryService MachineCategoryService => 
			_machineCategoryService.Value;
       
		public ServiceManager(
			IRepositoryManager manager,
			IConfigManager configs,
			IMapper mapper,
			IMicroService microServices)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(manager, configs, mapper, microServices));
			_mailService = new Lazy<IMailService>(() =>
				new MailService(configs));
			_machineService = new Lazy<IMachineService>(() => 
				new MachineService(manager, FileService));
			_fileService = new Lazy<IFileService>(() => 
				new FileService(configs));
			_sliderService = new Lazy<ISliderService>(() => 
				new SliderService(manager, configs, FileService));
			_formService = new Lazy<IFormService>(() => 
				new FormService(manager));
			_machineCategoryService = new Lazy<IMachineCategoryService>(() => 
				new MachineCategoryService(manager));
        }
	}
}