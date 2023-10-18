using System.Diagnostics.SymbolStore;

namespace Entities.ViewModels
{
    public record MachineView
    {
        public Guid Id { get; init; }
        public string MainCategoryName { get; init; }
        public string SubCategoryName { get; init; }
        public string BrandName { get; init; }
        public string Model { get; init; }
		public string HandStatus { get; init; }
		public Int16 Stock { get; init; }
        public Int16 Rented { get; init; }
        public Int16 Sold { get; init; }
        public Int16 Year { get; init; }
        public string ImagePath { get; init; }
        public string PdfPath { get; init; }
        public IDictionary<string, string> Descriptions { get; } 
        public DateTime CreatedAt { get; init; }

        public MachineView() 
            => Descriptions = new Dictionary<string, string>();
    }

    public record DescriptionPartForMachineView(string Language, string Description);        
}
