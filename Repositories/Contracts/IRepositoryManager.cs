namespace Repositories.Contracts
{
	public interface IRepositoryManager
	{
		IUserRepository UserRepository { get; }
		ICompanyRepository CompanyRepository { get; }
		Task SaveAsync();
	}
}
