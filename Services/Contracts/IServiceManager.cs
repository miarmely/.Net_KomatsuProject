namespace Services.Contracts
{
	public interface IServiceManager
	{
		IUserService UserService { get; }
		ICompanyService CompanyService { get; }
		IMailService MailService { get; }
	}
}
