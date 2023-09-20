namespace Entities.ViewModels
{
    public record MachineView
    {
        public Guid Id { get; init; }
        public string BrandName { get; init; }
        public string MainCategoryName { get; init; }
        public string SubCategoryName { get; init; }
        public string Model { get; init; }
        public Int16 Stock { get; init; }
        public Int16 Rented { get; init; }
        public Int16 Sold { get; init; }
        public Int16 Year { get; init; }
        public DateTime CreatedAt { get; init; }
        public string UsageStatus { get; init; }
        public string ImagePath { get; init; }
    }
}
