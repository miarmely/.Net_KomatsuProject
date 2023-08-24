using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class RepositoryManager : IRepositoryManager
	{
		private readonly Lazy<IUserRepository> _userRepository;
		public IUserRepository UserRepository => _userRepository.Value;

		public RepositoryManager(RepositoryContext context)
		{
			_userRepository = new Lazy<IUserRepository>(() =>
				new UserRepository(context));
		}
	}
}
