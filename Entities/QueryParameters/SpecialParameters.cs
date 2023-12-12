using Entities.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record LanguageParam
	{
		[Required]
		[MiarLength(2, 2, "Dil", "Language")]
		public string Language { get; init; }
	}
}
