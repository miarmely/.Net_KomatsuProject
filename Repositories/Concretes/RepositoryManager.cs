using Repositories.Contracts;
using Repositories.EF;
using System.Runtime.CompilerServices;

namespace Repositories.Concretes
{
	public class RepositoryManager : IRepositoryManager
	{
		private readonly RepositoryContext _context;
		
		private readonly Lazy<IUserRepository> _userRepository;

		private readonly Lazy<ICompanyRepository> _companyRepository;
		public IUserRepository UserRepository => _userRepository.Value;
		public ICompanyRepository CompanyRepository => _companyRepository.Value;

		public RepositoryManager(RepositoryContext context)
		{
			_context = context;
			_userRepository = new Lazy<IUserRepository>(() =>
				new UserRepository(context));
			_companyRepository = new Lazy<ICompanyRepository>(() =>
				new CompanyRepository(context));
		}

		public async Task SaveAsync() =>
			await _context.SaveChangesAsync();
	}
}
