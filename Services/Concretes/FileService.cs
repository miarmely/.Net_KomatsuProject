using Dapper;
using Entities.DtoModels;
using Entities.ViewModels;
using Org.BouncyCastle.Utilities.Encoders;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;


namespace Services.Concretes
{
	public class FileService : IFileService
	{
        private readonly IRepositoryManager _manager;

        public FileService(IRepositoryManager manager) =>
            _manager = manager;

        public async Task<IEnumerable<SliderView>> GetAllSlidersAsync() =>
            await _manager.FileRepository
                .GetAllSlidersAsync();
        
        public async Task UploadSlidersAsync(SliderDto sliderDto)
		{
            #region set paths
            var baseFilePath = Directory
                .GetCurrentDirectory()
                .Replace(
					"Temsa_Api",
                    $"Temsa_Web\\wwwroot\\{sliderDto.PathAfterWwwroot}\\");

            var fullFilePath = baseFilePath 
                + "\\" 
                + sliderDto.FileName;

            var filePathForDb = sliderDto.PathAfterWwwroot 
                + "\\" 
                + sliderDto.FileName;
            #endregion

            #region upload slider to folder

            #region decode file in base64
            var contentInBytes = Base64
                .Decode(sliderDto.FileContentInBase64Str);
            #endregion

            #region create file
            await File.WriteAllBytesAsync(
                fullFilePath, 
				contentInBytes);
            #endregion

            #endregion

            #region upload slider to db
            // set parameters
            var paramaters = new DynamicParameters();
            paramaters.Add("SliderPath", filePathForDb, DbType.String);

            // upload
            await _manager.FileRepository
                .UploadSliderAsync(paramaters);
            #endregion
        }

        public async Task DeleteAllSlidersAsync(string pathAfterWwwroot)
        {
            #region set base file path
            var baseFilePath = Directory
                .GetCurrentDirectory()
                .Replace(
                    "Temsa_Api",
                    $"Temsa_Web\\wwwroot\\{pathAfterWwwroot}\\");
            #endregion

            await DeleteAllFilesOnDirectoryAsync(baseFilePath);

            await _manager.FileRepository
                .TruncateAllSlidersAsync();
        }
            

        #region private
        private async Task DeleteAllFilesOnDirectoryAsync(string baseFilePath)
		{
            #region delete all files
            var filePathsInDirectory = Directory.GetFiles(baseFilePath);

            foreach (var filePath in filePathsInDirectory)
                File.Delete(filePath);
            #endregion
        }
        #endregion
    }
}
