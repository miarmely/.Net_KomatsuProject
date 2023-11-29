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

        public async Task UploadSliderToFolderAsync(
            SliderDtoForUploadToFolder sliderDto)
        {
            #region set paths
            var fullFolderPath = await GetFullFolderPathAsync(
                sliderDto.FolderPathAfterWwwroot);

            var fullFilePath = fullFolderPath
                + @"\"
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
        }

		public async Task UploadSlidersToDbAsync(SliderDtoForUploadToDb sliderDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add(
				"FileNames",
                sliderDto.ToString(), 
                DbType.String);
            #endregion

            #region upload sliders
            await _manager.FileRepository
				.UploadSlidersAsync(parameters);
			#endregion
		}

		public async Task<IEnumerable<SliderView>> GetAllSlidersAsync(
            SliderParamatersForDisplayAll sliderParams)
        {
            #region set parameters
            var parameters = new DynamicParameters();
            
            parameters.Add("Language", 
                sliderParams.Language, 
                DbType.String);

            parameters.Add("FolderPathAfterWwwroot",
                sliderParams.FolderPathAfterWwwroot,
                DbType.String);

            parameters.Add("StatusCode", 
                0, 
                DbType.Int16,
                ParameterDirection.Output);

            parameters.Add("ErrorCode", 
                "", 
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorDescription", 
                "", 
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorMessage", 
                "", 
                DbType.String,
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
			SliderParametersForDisplayOne sliderParams)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            parameters.Add("Language", sliderParams.Language, DbType.String);
			parameters.Add("SliderNo", sliderParams.SliderNo, DbType.Int16);

            parameters.Add("FolderPathAfterWwwroot",
				sliderParams.FolderPathAfterWwwroot,
                DbType.String);
            
            parameters.Add("StatusCode", 
                null, 
                DbType.Int16,
                ParameterDirection.Output);

            parameters.Add("ErrorCode", 
                "", 
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorDescription", 
                "", 
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorMessage", 
                "", 
                DbType.String,
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

        public async Task DeleteMultipleSliderAsync(
            SliderParametersForDelete sliderParams,
            SliderDtoForDelete sliderDto)
        {
            #region delete from folder
            await DeleteMultipleFileOnFolderAsync(
				sliderParams.Language,
				sliderParams.FolderPathAfterWwwroot,
                sliderDto.FileNamesToBeNotDelete);
            #endregion

            #region truncate slider table
            await _manager.FileRepository
                .TruncateAllSlidersAsync();
            #endregion
        }


        #region private

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

        #endregion
    }
}
