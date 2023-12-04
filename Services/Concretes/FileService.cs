using Entities.ConfigModels.Contracts;
using Entities.Exceptions;
using Org.BouncyCastle.Utilities.Encoders;
using Repositories.Contracts;
using Services.Contracts;


namespace Services.Concretes
{
    public class FileService : IFileService
	{
        private readonly IConfigManager _configs;

        public FileService(IConfigManager configs) =>
            _configs = configs;

        public async Task UploadFileToFolderAsync(
            string folderPath,
            string fileName,
            string fileContentInBase64Str)
        {
			#region set paths
			var fullFolderPath = await GetFullFolderPathAsync(folderPath);

			var fullFilePath = fullFolderPath
				+ @"\"
				+ fileName;
			#endregion

			#region upload file to folder

			#region decode file in base64
			var fileContentInBytes = Base64
				.Decode(fileContentInBase64Str);
			#endregion

			#region create file
			await File.WriteAllBytesAsync(
				fullFilePath,
				fileContentInBytes);
			#endregion

			#endregion
		}

		public async Task<string[]> GetFullFilePathsOnDirectoryAsync(
            string language,
            string folderPathAfterWwwroot)
        {
            #region set variables
            string[] filePathsInDirectory;
            var fullFolderPath = await GetFullFolderPathAsync(folderPathAfterWwwroot);
            #endregion

            #region get files on directory (throw)
            try
            {
                filePathsInDirectory = Directory.GetFiles(fullFolderPath);
            }
            catch (Exception ex)
            {
                #region when directory not found (throw)
                throw new ErrorWithCodeException(
                    _configs.ErrorDetails.ConvertToErrorDto(
                        language,
                        _configs.ErrorDetails.NF_S_FP));
                #endregion
            }
            #endregion

            return filePathsInDirectory;
        }

		public async Task<string> GetFullFolderPathAsync(
            string folderPathAfterWwwroot) =>
                Directory
                    .GetCurrentDirectory()
                    .Replace(
                        "Temsa_Api",
                        $@"Temsa_Web\wwwroot\{folderPathAfterWwwroot}\");

		public async Task DeleteMultipleFileOnFolderAsync(
            string language,
            string folderPathAfterWwwroot,
            List<string> FileNamesToBeNotDelete)
        {
            #region get full file names on directory (throw)
            var fullFilePathsOnDirectory = await GetFullFilePathsOnDirectoryAsync(
                language,
                folderPathAfterWwwroot);

            var fullFolderPath = await GetFullFolderPathAsync(folderPathAfterWwwroot);
            #endregion

            #region delete files on directory if not in FileNamesToBeNotDelete
            foreach (var fullFileNameOnDirectory in fullFilePathsOnDirectory)
            {
                #region delete file on directory
                if (!FileNamesToBeNotDelete.Any(fileName => 
                    fullFolderPath + fileName == fullFileNameOnDirectory))
                {
                    File.Delete(fullFileNameOnDirectory);
                }
                #endregion
            }
            #endregion
        }

		public async Task DeleteFileOnFolderByPathAsync(
            string folderPathAfterWwwroot,
            string fileName)
        {
			#region delete one file on folder
			var fullFolderPath = await GetFullFolderPathAsync(folderPathAfterWwwroot);

			File.Delete(fullFolderPath + "\\" + fileName);
			#endregion
		}

	}
}
