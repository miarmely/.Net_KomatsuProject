using Entities.ConfigModels.Contracts;
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

		public async Task SendMailAsync(
			List<string> To,
			string subject,
			TextPart body)
		{
			var mimeMessage = new MimeMessage();

			#region set "from"
			var displayName = _config.MailSettings.DisplayName;
			var from = _config.MailSettings.From;

			mimeMessage.From.Add(new MailboxAddress(displayName, from));
			#endregion

			#region set "to"
			foreach (var to in To)
				mimeMessage.To.Add(MailboxAddress.Parse(to));
			#endregion

			#region set "subject" and "body"
			mimeMessage.Subject = subject;
			mimeMessage.Body = body;
			#endregion

			#region send mail
			using (var smtpClient = new SmtpClient())
			{
				try
				{
					#region set socket option
					var socketOption = _config.MailSettings.UseSSL ?
						SecureSocketOptions.SslOnConnect  // active SSL
						: SecureSocketOptions.StartTls;  // active TLS
					#endregion

					#region connect to smtp
					await smtpClient.ConnectAsync(
						_config.MailSettings.Host,
						_config.MailSettings.Port,
						socketOption);
					#endregion

					#region set authentication
					await smtpClient.AuthenticateAsync(
						_config.MailSettings.Username,
						_config.MailSettings.Password);
					#endregion

					await smtpClient.SendAsync(mimeMessage);
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
				finally
				{
					await smtpClient.DisconnectAsync(true);
					smtpClient.Dispose();
				}
			}
			#endregion
		}
	}
}
