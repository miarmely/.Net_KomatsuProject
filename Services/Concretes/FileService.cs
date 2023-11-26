using Dapper;
using Entities.DtoModels;
using Entities.Exceptions;
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

        public async Task<IEnumerable<SliderView>> GetAllSlidersAsync(
            string language)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            parameters.Add("Language", language, DbType.String);

            parameters.Add("StatusCode", language, DbType.Int16,
                ParameterDirection.Output);

            parameters.Add("ErrorCode", language, DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorDescription", language, DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorMessage", language, DbType.String,
                ParameterDirection.Output);
            #endregion

            #region get all sliders (throw)
            var sliderViews = await _manager.FileRepository
                .GetAllSlidersAsync(parameters);

            // when any slider not found (throw)
            if (sliderViews.Count() == 0)
                throw new ErrorWithCodeException(
                    parameters.Get<Int16>("StatusCode"),
                    parameters.Get<string>("ErrorCode"),
                    parameters.Get<string>("ErrorDescription"),
                    parameters.Get<string>("ErrorMessage"));
            #endregion

            return sliderViews;
        }


        public async Task<string> GetSliderPathBySliderNoAsync(
            string language,
            int sliderNo)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            parameters.Add("Language", language, DbType.String);
            parameters.Add("SliderNo", sliderNo, DbType.Int16);

            parameters.Add("StatusCode", null, DbType.Int16,
                ParameterDirection.Output);

            parameters.Add("ErrorCode", "", DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorDescription", "", DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorMessage", "", DbType.String,
                ParameterDirection.Output);
            #endregion

            #region get slider path (throw)
            var sliderPath = await _manager.FileRepository
                .GetSliderPathBySliderNoAsync(parameters);

            // when slider path not found (throw)
            if (sliderPath == null)
                throw new ErrorWithCodeException(
                    parameters.Get<Int16>("StatusCode"),
                    parameters.Get<string>("ErrorCode"),
                    parameters.Get<string>("ErrorDescription"),
                    parameters.Get<string>("ErrorMessage"));
            #endregion

            return sliderPath;
        }

        public async Task UploadSliderAsync(SliderDto sliderDto)
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
            try
            {
                var filePathsInDirectory = Directory.GetFiles(baseFilePath);
            }
            catch (DirectoryNotFoundException ex)
            {
                throw new ErrorWithCodeException(
                    404,
                    "N")
            }
            
            
            
                
                

            foreach (var filePath in filePathsInDirectory)
                File.Delete(filePath);
            #endregion
        }
        #endregion
    }
}
