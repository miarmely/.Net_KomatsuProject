using System.ComponentModel.DataAnnotations;

namespace Entities.QueryParameters
{
    public record MachineParametersForUpdate
    {
		public Guid Id { get; init; }
		public string Language { get; init; }
        public string OldMainCategoryName { get; init; }
		public string OldSubCategoryName { get; init; }
	}

    public record MachineParametersForDisplaySubCategoryNames
    {
       public string Language { get; init; }
       public string? MainCategoryName { get; init; }
    }


    public record MachineParametersForCreate(
        [Required] string Language,
		[Required] string FolderPathAfterWwwroot);
}
