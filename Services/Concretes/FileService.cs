using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.SliderDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Org.BouncyCastle.Utilities.Encoders;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;


namespace Services.Concretes
{
    public partial class FileService : IFileService
	{
        private readonly IRepositoryManager _manager;
        private readonly IConfigManager _configs;

        public FileService(
            IRepositoryManager manager,
            IConfigManager configs)
        {
            _manager = manager;
            _configs = configs;
        }

        private async Task<string[]> GetFullFilePathsOnDirectoryAsync(
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

        private async Task<string> GetFullFolderPathAsync(
            string folderPathAfterWwwroot) =>
                Directory
                    .GetCurrentDirectory()
                    .Replace(
                        "Temsa_Api",
                        $@"Temsa_Web\wwwroot\{folderPathAfterWwwroot}\");

        private async Task DeleteMultipleFileOnFolderAsync(
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

        private async Task DeleteFileOnFolderByPathAsync(
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
