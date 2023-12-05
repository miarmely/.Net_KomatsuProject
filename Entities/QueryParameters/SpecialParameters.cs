using Entities.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record LanguageParam
	{
		[Required][MiarLength(2, 2)] public string Language { get; init; }
	}
}
