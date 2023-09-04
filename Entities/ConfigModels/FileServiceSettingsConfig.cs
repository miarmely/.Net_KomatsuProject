namespace Entities.ConfigModels
{
	public record FileServiceSettingsConfig
	{
        public int MaxChunkSizeInBytes { get; init; }
    }
}
