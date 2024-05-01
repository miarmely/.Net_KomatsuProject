using Services.MiarLibrary.Contracts;

namespace Services.Contracts
{
	public interface IServiceManager
	{
		IUserService UserService { get; }
		IMailService MailService { get; }
		IMachineService MachineService { get; }
		IFileService FileService { get; }
		ISliderService SliderService { get; }
		IFormService FormService { get; }
		IMachineCategoryService MachineCategoryService { get; }
		IPasswordService PasswordService { get; }
	}
}
