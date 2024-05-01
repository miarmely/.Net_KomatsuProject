using Entities.MiarLibrary.Attributes;

namespace Entities.DtoModels.MachineDtos
{
	public record MachineDtoForCreate
	{
		[MiarLength(1, 50, "Resim Adı", "Image Name")]
		public string ImageName { get; init; }

		[MiarLength(1, 50, "Video Adı", "Video Name")]
		public string? VideoName { get; init; }

        [MiarLength(1, 50, "PDF Adı", "PDF Name")]
        public string PdfName { get; init; }

        [MiarLength(1, 50, "Ana Kategori", "Main Category")]
		public string MainCategoryName { get; init; }

		[MiarLength(1, 50, "Alt Kategori", "Sub Category")]
		public string SubCategoryName { get; init; }

		[MiarLength(1, 50, "Model", "Model")]
		public string Model { get; init; }

		[MiarLength(1, 50, "Marka", "Brand")]
		public string BrandName { get; init; }

		[MiarRange(1900, 2099, "Yıl", "Year")]
		public int Year { get; init; }

		[MiarRange(1, 5000, "Stok", "Stock")]
		public int? Stock { get; init; }

		public string HandStatus { get; init; }

		public DescriptionsByLanguages? Descriptions { get; init; }
	}
}
