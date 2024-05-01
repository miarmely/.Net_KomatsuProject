using Entities.MiarLibrary.Attributes;
using Entities.QueryParameters;
using System.ComponentModel.DataAnnotations;


namespace Entities.MiarLibrary.DtoModels
{
    public record PasswordDtoForUpdate
    {
        [MiarLength(6, 16, "Eski Şifre", "Old Password")]
        public string OldPassword { get; init; }

		[MiarLength(6, 16, "Yeni Şifre", "New Password")]
		[MiarEnglishChars(new char[] { '.', ',', '!', '?', '-', ':', ';' },
			"Yeni Şifre", "New Password")]
		[MiarPassword(true, true, true, null, 1, 1, 1, "Yeni Şifre", "New Password")]
		public string NewPassword { get; init; }

		[MiarLength(6, 16, "Yeni Şifre Tekrar", "Old Password Again")]
		public string NewPasswordAgain { get; init; }
    }
}