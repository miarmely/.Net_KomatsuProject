using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels.MachineDtos
{
    public record MachineDtoForDelete
    {
        public Guid MachineId { get; init; }
        public string ImageName { get; init; }
        public string? VideoName { get; init; }
		public string PdfName { get; init; }
    }
}
