namespace Entities.DtoModels.SliderDtos
{
    public record SliderDtoForUploadToFolder(
		string FolderPathAfterWwwroot,
		string FileName,
		string FileContentInBase64Str);

	public record SliderDtoForUploadToDb
	{
		public List<string> FileNames { get; init; }

		public override string ToString() =>
			String.Join(",", FileNames);
	}
}
