using Entities.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record UserParamsForUpdate : LanguageParams
	{
		[Required]
		[MiarLength(10, 10, "Telefon", "Phone")]
		[MiarPhone]
		public string TelNo { get; init; }
    }
}
