using Repositories.Contracts;
using Repositories.EF;

namespace Repositories.Concretes
{
	public class RepositoryManager : IRepositoryManager
	{
		#region fields
		private readonly RepositoryContext _context;
		private readonly Lazy<IUserRepository> _userRepository;
		private readonly Lazy<ICompanyRepository> _companyRepository;
		private readonly Lazy<IUserAndRoleRepository> _userAndRoleRepository;
		private readonly Lazy<IRoleRepository> _roleRepository;
		private readonly Lazy<IMachineRepository> _machineRepository;
		private readonly Lazy<IMainCategoryRepository> _mainCategoryRepository;
		private readonly Lazy<ICategoryRepository> _categoryRepository;
		private readonly Lazy<IBrandRepository> _brandRepository;
		#endregion

		#region properties
 		public IUserRepository UserRepository => _userRepository.Value;
		public ICompanyRepository CompanyRepository => _companyRepository.Value;
		public IUserAndRoleRepository UserAndRoleRepository => _userAndRoleRepository.Value;
		public IRoleRepository RoleRepository => _roleRepository.Value;
		public IMachineRepository MachineRepository => _machineRepository.Value;
		public IMainCategoryRepository MainCategoryRepository => _mainCategoryRepository.Value;
		public ICategoryRepository CategoryRepository => _categoryRepository.Value;
		public IBrandRepository BrandRepository => _brandRepository.Value;
		#endregion

		#region functions
		public RepositoryManager(RepositoryContext context)
		{
			_context = context;
			_userRepository = new Lazy<IUserRepository>(() =>
				new UserRepository(context));
			_companyRepository = new Lazy<ICompanyRepository>(() =>
				new CompanyRepository(context));
			_userAndRoleRepository = new Lazy<IUserAndRoleRepository>(() =>
				new UserAndRoleRepository(context));
			_roleRepository = new Lazy<IRoleRepository>(() => 
				new RoleRepository(context));
			_machineRepository = new Lazy<IMachineRepository>(() => 
				new MachineRepository(context));
			_mainCategoryRepository = new Lazy<IMainCategoryRepository>(() => 
				new MainCategoryRepository(context));
			_categoryRepository = new Lazy<ICategoryRepository>(() =>
				new CategoryRepository(context));
			_brandRepository = new Lazy<IBrandRepository>(() => 
				new BrandRepository(context));
		}

		public async Task SaveAsync() =>
			await _context.SaveChangesAsync();
		#endregion
	}
}
