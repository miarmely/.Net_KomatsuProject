namespace Repositories.Contracts
{
	public interface IRepositoryManager
	{
		IUserRepository UserRepository { get; }
		ICompanyRepository CompanyRepository { get; }
		IUserAndRoleRepository UserAndRoleRepository { get; }
		IRoleRepository RoleRepository { get; }
		Task SaveAsync();
	}
}
