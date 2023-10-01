namespace Services.Contracts
{
	public interface IServiceManager
	{
		IUserService UserService { get; }
		IMailService MailService { get; }
		IMachineService MachineService { get; }
		IFileService FileService { get; }
	}
}
