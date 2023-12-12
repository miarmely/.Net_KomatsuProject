using Entities.Attributes;


namespace Entities.DtoModels.MachineDtos
{
	public record MachineDtoForCreate
	{
		[MiarLength(1, 50, "Resim Adı", "Image Name")] 
		public string ImageName { get; init; }

		[MiarLength(1, 50, "Ana Kategori", "Main Category")]
		public string MainCategoryName { get; init; }

		[MiarLength(1, 50, "Alt Kategori", "Sub Category")]
		public string SubCategoryName { get; init; }

		[MiarLength(1, 50, "Model", "Model")]
		public string Model { get; init; }

		[MiarLength(1, 50, "Marka", "Brand")]
		public string BrandName { get; init; }

		[MiarLength(1, 50, "El Durumu", "Hand Status")]
		public string HandStatus { get; init; }

		[MiarLength(1, 50, "PDF Adı", "PDF Name")]
		public string PdfName { get; init; }
		
		[MiarRange(1, 5000, "Stok", "Stock")]
		public Int16 Stock { get; init; }

		[MiarRange(1900, 2099, "Yıl", "Year")]
		public Int16 Year { get; init; }

		public DescriptionsByLanguages? Descriptions { get; init; }
		public string ImageContentInBase64Str { get; init; }
		public string PdfContentInBase64Str { get; init; }
	}
}
