using Entities.ErrorModels;
using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels
{
	public record UserDtoForLogin
	{
		public string TelNo { get; init; }
		public string Password { get; init; }
	}
}
