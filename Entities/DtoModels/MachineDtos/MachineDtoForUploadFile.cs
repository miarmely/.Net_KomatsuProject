using Entities.QueryParameters;

namespace Entities.DtoModels.MachineDtos
{
	public record MachineDtoForUploadFile
	{
        
        public string FileContentInBase64Str { get; init; }
    }
}
