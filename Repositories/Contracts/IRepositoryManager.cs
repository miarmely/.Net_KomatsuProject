namespace Repositories.Contracts
{
	public interface IRepositoryManager
	{
		IUserRepository UserRepository { get; }
		IMachineRepository MachineRepository { get; }
	}
}
