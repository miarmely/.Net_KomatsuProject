using Dapper;
using Entities.ConfigModels.Contracts;
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
        private readonly IConfigManager _configs;

        public FileService(
            IRepositoryManager manager,
            IConfigManager configs)
        {
            _manager = manager;
            _configs = configs;
        }

        public async Task UploadSliderAsync(SliderDto sliderDto)
        {
            #region set paths
            var fullFolderPath = Directory
                .GetCurrentDirectory()
                .Replace(
                    "Temsa_Api",
                    $@"Temsa_Web\wwwroot\{sliderDto.FolderPathAfterWwwroot}\");

            var fullFilePath = fullFolderPath
                + "\\"
                + sliderDto.FileName;

            var filePathForDb = sliderDto.FolderPathAfterWwwroot
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
        
        public async Task DeleteAllSlidersAsync(string language, string folderPathAfterWwwroot)
        {
            #region set base file path
            var baseFilePath = Directory
                .GetCurrentDirectory()
                .Replace(
                    "Temsa_Api",
                    $@"Temsa_Web\wwwroot\{folderPathAfterWwwroot}\");
            #endregion

            await DeleteAllFilesOnDirectoryAndDbAsync(language, baseFilePath);
        }


        #region private

        private async Task DeleteAllFilesOnDirectoryAndDbAsync(
            string language, 
            string baseFilePath)
        {
            #region get files on directory
            string[] filePathsInDirectory;

            try
            {
                filePathsInDirectory = Directory
                    .GetFiles(baseFilePath);
            }
            catch (Exception ex)
            {
                #region when directory not found (throw)
                
                #region set errorMessage by language 
                var error = _configs.ErrorMessages.NF_S_FP;
                var errorMessage = language switch
                {
                    "TR" => error.ErrorMessage.TR,
                    "EN" => error.ErrorMessage.EN
                };
                #endregion

                #region throw error
                throw new ErrorWithCodeException(
                    error.StatusCode,
                    error.ErrorCode,
                    error.ErrorDescription,
                    errorMessage);
                #endregion

                #endregion
            }
            #endregion

            #region delete all files
            foreach (var filePath in filePathsInDirectory)
                File.Delete(filePath);
            #endregion

            #region delete on db
            if (filePathsInDirectory.Length != 0)
                await _manager.FileRepository
                   .TruncateAllSlidersAsync();
            #endregion
        }

        #endregion
    }
}
