namespace Repositories.Contracts
{
	public interface IRepositoryManager
	{
		IUserRepository UserRepository { get; }
		ICompanyRepository CompanyRepository { get; }
		IUserAndRoleRepository UserAndRoleRepository { get; }
		IRoleRepository RoleRepository { get; }
		IMachineRepository MachineRepository { get; }
		IMainCategoryRepository MainCategoryRepository { get; }
		ICategoryRepository CategoryRepository { get; }
		IBrandRepository BrandRepository { get; }
		Task SaveAsync();
	}
}
