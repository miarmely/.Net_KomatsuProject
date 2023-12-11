using Entities.Enums;

namespace Services.Contracts
{
    public interface IFileService
    {
		Task UploadFileToFolderAsync(
			string language,
			string folderPath,
			string fileName,
			string fileContentInBase64Str,
			FileTypes fileType);

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
			string language,
			string folderPathAfterWwwroot,
			string fileName,
			FileTypes fileType);
	}
}
