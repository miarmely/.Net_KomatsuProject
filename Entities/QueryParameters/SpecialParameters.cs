using Entities.MiarLibrary.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Entities.QueryParameters
{
	public record LanguageParams
	{
		[Required]
		[MiarEqual(new object[] {"TR", "EN"}, "Dil", "Language")]
		public string? Language { get; init; }
	}

	public record PagingParams
	{
		[Required]
		[MiarRange(1,
			displayNameInTR: "Sayfa Numarası",
			displayNameInEN: "Page Number")]
		public int PageNumber { get; init; }

		[Required]
		[MiarRange(1, 50, "Sayfa Boyutu", "Page Size")]
		public int PageSize { get; init; }
	}

	public record LanguageAndPagingParams : LanguageParams
	{
		[Required]
		[MiarRange(1,
			displayNameInTR: "Sayfa Numarası",
			displayNameInEN: "Page Number")]
		public int PageNumber { get; init; }

		[Required]
		[MiarRange(1, 50, "Sayfa Boyutu", "Page Size")]
		public int PageSize { get; init; }
	}
}
