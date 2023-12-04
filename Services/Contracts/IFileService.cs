namespace Services.Contracts
{
    public interface IFileService
    {
		Task UploadFileToFolderAsync(
			string folderPath,
			string fileName,
			string fileContentInBase64Str);

		Task<string[]> GetFullFilePathsOnDirectoryAsync(
			string language,
			string folderPathAfterWwwroot);

		Task<string> GetFullFolderPathAsync(
			string folderPathAfterWwwroot);

		Task DeleteMultipleFileOnFolderAsync(
			string language,
			string folderPathAfterWwwroot,
			List<string> FileNamesToBeNotDelete);

		Task DeleteFileOnFolderByPathAsync(
			string folderPathAfterWwwroot,
			string fileName);
	}
}
