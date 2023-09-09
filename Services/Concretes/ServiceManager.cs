using AutoMapper;
using Entities.ConfigModels.Contracts;
using Microsoft.AspNetCore.Http;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class ServiceManager : IServiceManager
    {
	
		private readonly Lazy<IUserService> _userService;
		private readonly Lazy<ICompanyService> _companyService;
		private readonly Lazy<IMailService> _mailService;
		private readonly Lazy<IMachineService> _machineService;
		private readonly Lazy<IFileService> _fileService;
		private readonly Lazy<IDtoConverterService> _dtoConverterService;
		private readonly Lazy<IDataConverterService> _dataConverterService;
		
		public IUserService UserService => _userService.Value;
		public ICompanyService CompanyService => _companyService.Value;
		public IMailService MailService => _mailService.Value;
		public IMachineService MachineService => _machineService.Value;
		public IFileService FileService => _fileService.Value;
		public IDtoConverterService DtoConverterServcice => _dtoConverterService.Value;
		public IDataConverterService DataConverterService => _dataConverterService.Value;

		public ServiceManager(IRepositoryManager repository,
			IConfigManager config,
			IMapper mapper)
        {
			_userService = new Lazy<IUserService>(() => 
				new UserService(repository, config, mapper, DtoConverterServcice));
			_companyService = new Lazy<ICompanyService>(() => 
				new CompanyService(repository));
			_mailService = new Lazy<IMailService>(() =>
				new MailService(config));
			_machineService = new Lazy<IMachineService>(() => 
				new MachineService(repository, DtoConverterServcice, 
					DataConverterService, mapper));
			_fileService = new Lazy<IFileService>(() => 
				new FileService(config));
			_dtoConverterService = new Lazy<IDtoConverterService>(() =>
				new DtoConverterService(repository));
			_dataConverterService = new Lazy<IDataConverterService>(() =>
				new DataConverterService(repository));
        }
	}
}
