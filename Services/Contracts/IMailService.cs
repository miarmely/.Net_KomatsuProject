using Entities.DtoModels;

namespace Services.Contracts
{
    public interface IMailService
	{
		Task SendMailAsync(MailDto mailDto);
	}
}
