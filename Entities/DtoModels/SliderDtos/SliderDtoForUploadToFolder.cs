namespace Entities.DtoModels.SliderDtos
{
	public record SliderDtoForUploadToDb
	{
		public List<string> FileNames { get; init; }
		public override string ToString() =>
			String.Join(",", FileNames);
	}

	public record SliderDtoForUploadToFolder(
		string FileName,
		string FileContentInBase64Str);
}
