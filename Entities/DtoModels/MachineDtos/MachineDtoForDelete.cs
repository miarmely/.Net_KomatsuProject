using System.ComponentModel.DataAnnotations;

namespace Entities.DtoModels.MachineDtos
{
    public record MachineDtoForDelete
    {
        [Required] public Guid MachineId { get; init; }
        [Required] public string ImageName { get; init; }
		[Required] public string PdfName { get; init; }
    }
}
