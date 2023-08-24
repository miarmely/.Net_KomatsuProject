using Services.Concretes;
using System.Runtime.CompilerServices;

namespace Services.Contracts
{
	public interface IServiceManager
	{
		IUserService UserService { get; }
	}
}
