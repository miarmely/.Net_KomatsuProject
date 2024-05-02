using Entities.DtoModels;
using MimeKit;

namespace Services.Contracts
{
    public interface IMailService
	{
		Task SendMailAsync(List<string> To, string subject, TextPart body);
	}
}
