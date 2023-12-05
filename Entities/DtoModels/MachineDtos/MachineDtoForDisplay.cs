using Entities.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace Entities.DtoModels.MachineDtos
{
    public record MachineDtoForDisplay
    {
		[Required][MiarLength(2, 2)] public string Language { get; init; }
		public string? MainCategoryName { get; init; }
        public string? SubCategoryName { get; init; }
        public string? BrandName { get; init; }
        public string? Model { get; init; }
        public Int16? Stock { get; init; }
        public Int16? Rented { get; init; }
        public Int16? Sold { get; init; }
        public Int16? Year { get; init; }
        public string? HandStatus { get; init; }
    }
}
