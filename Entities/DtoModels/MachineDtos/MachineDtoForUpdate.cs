using Entities.MiarLibrary.Attributes;


namespace Entities.DtoModels.MachineDtos
{
	public record MachineDtoForUpdate
	{
		[MiarLength(1, 50, "Resim Adı", "Image Name")]
		public string? ImageName { get; init; }

		[MiarLength(1, 50, "Video Adı", "Video Name")]
		public string? VideoName { get; init; }

		[MiarLength(1, 50, "Ana Kategori", "Main Category")]
		public string? MainCategoryName { get; init; }

		[MiarLength(1, 50, "Alt Kategori", "Sub Category")]
		public string? SubCategoryName { get; init; }

		[MiarLength(1, 50, "Model", "Model")]
		public string? Model { get; init; }

		[MiarLength(1, 50, "Marka", "Brand")]
		public string? BrandName { get; init; }

		[MiarLength(1, 50, "El Durumu", "Hand Status")]
		public string? HandStatus { get; init; }

		[MiarLength(1, 50, "PDF Adı", "PDF Name")]
		public string? PdfName { get; init; }

		[MiarRange(0, 5000, "Stok", "Stock")]
		public int? Stock { get; init; }

		[MiarRange(0, 5000, "Kiralık", "Rented")]
		public int? Rented { get; init; }

		[MiarRange(0, 5000, "Satılık", "Sold")]
		public int? Sold { get; init; }

		[MiarRange(1900, 2099, "Yıl", "Year")]
		public int? Year { get; init; }

        public DescriptionsByLanguages? Descriptions { get; init; }
	}

	public record DescriptionsByLanguages
	{
		[MiarLength(1, -1, "TR Açıklama", "Description In TR")]
		public string? TR { get; init; }

		[MiarLength(1, -1, "EN Açıklama", "Description In EN")]
		public string? EN { get; init; }
	}
}


