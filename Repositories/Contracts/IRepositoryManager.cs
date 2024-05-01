using Repositories.MiarLibrary.Contracts;

namespace Repositories.Contracts
{
	public interface IRepositoryManager
	{
		IUserRepository UserRepository { get; }
		IMachineRepository MachineRepository { get; }
		IFileRepository FileRepository { get; }
		IFormRepository FormRepository { get; }
		IMachineCategoryRepository MachineCategoryRepository { get; }
		IPasswordRepository PasswordRepository { get; }
	}
}