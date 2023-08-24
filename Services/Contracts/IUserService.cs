using Entities.ViewModels;

namespace Services.Contracts
{
	public interface IUserService
	{
		Task<UserView> LoginAsync(UserView viewModel);
		Task<UserView> RegisterAsync(UserView viewModel);
		Task<bool> IsEmailSyntaxValidAsync(string email);
		Task<bool> IsTelNoSyntaxValidAsync(string telNo);
		Task<bool> IsPasswordSyntaxValidAsync(string password);
	}
}
