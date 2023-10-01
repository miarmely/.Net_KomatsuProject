using Entities.ConfigModels.Contracts;
using Repositories.Contracts;


namespace Repositories.Concretes
{
	public class RepositoryManager : IRepositoryManager
	{
		private readonly Lazy<IUserRepository> _userRepository;
		private readonly Lazy<IMachineRepository> _machineRepository;
		
 		public IUserRepository UserRepository => _userRepository.Value;
		public IMachineRepository MachineRepository => _machineRepository.Value;

		public RepositoryManager(
			RepositoryContext context,
			IConfigManager configs)
		{
			_userRepository = new Lazy<IUserRepository>(() =>
				new UserRepository(context, configs));
			_machineRepository = new Lazy<IMachineRepository>(() => 
				new MachineRepository(context, configs));
		}
	}
}
