using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.Exceptions;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Services.Contracts;


namespace Services.Concretes
{
    public class MailService : IMailService
	{
		private readonly IConfigManager _config;

		public MailService(IConfigManager config) =>
			_config = config;

		public async Task SendMailAsync(MailDto mailDto)
		{
			var mimeMessage = new MimeMessage();

			#region set "from" and "sender"
			var displayName = mailDto.DisplayName ?? _config.MailSettings.DisplayName;
			var from = mailDto.From ?? _config.MailSettings.From;

			mimeMessage.From.Add(new MailboxAddress(displayName, from));
			mimeMessage.Sender = new MailboxAddress(displayName, from);
			#endregion

			#region set "to"
			foreach (var to in mailDto.To)
				mimeMessage.To.Add(MailboxAddress
					.Parse(to));
			#endregion

			#region set "subject" and "body"
			// set subject
			mimeMessage.Subject = mailDto.Subject;

			// set "body"
			var bodyBuilder = new BodyBuilder();
			bodyBuilder.HtmlBody = mailDto.Body;
			mimeMessage.Body = bodyBuilder.ToMessageBody();
			#endregion

			#region send mail
			try
			{
				using (var smtpClient = new SmtpClient())
				{
					#region set socket option
					var socketOption = _config.MailSettings.UseSSL ?
						SecureSocketOptions.SslOnConnect  // active SSL
						: SecureSocketOptions.StartTls;  // active TLS
					#endregion

					#region connect to smtp
					await smtpClient.ConnectAsync(
						host: _config.MailSettings.Host,
						port: _config.MailSettings.Port,
						options: socketOption);
					#endregion

					#region set authentication
					await smtpClient.AuthenticateAsync(_config.MailSettings.Username,
						_config.MailSettings.Password);
					#endregion

					#region send mail
					await smtpClient.SendAsync(mimeMessage);
					await smtpClient.DisconnectAsync(true);
					#endregion
				}
			}
			catch (Exception ex)
			{
				#region for unexpected error
				throw new ExceptionWithCode(
					statusCode: 500,
					errorCode: "EE",
					errorDescription: $"Email Error -> {ex.Message}"
				);
				#endregion
			}
			#endregion
		}
	}
}
