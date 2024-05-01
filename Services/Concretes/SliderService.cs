using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.SliderDtos;
using Entities.Enums;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.ResponseCaching;
using Org.BouncyCastle.Utilities.Encoders;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;


namespace Services.Concretes
{
	public class SliderService : ISliderService
	{
		private readonly IRepositoryManager _manager;
		private readonly IConfigManager _configs;
		private readonly IFileService _fileService;

		public SliderService(
			IRepositoryManager manager,
			IConfigManager configs,
			IFileService fileService)
		{
			_manager = manager;
			_configs = configs;
			_fileService = fileService;
		}
			
        public async Task UploadSliderToFolderAsync(
			SliderParametersForUploadToFolder sliderParams,
			SliderDtoForUploadToFolder sliderDto) =>
				await _fileService.UploadFileToFolderAsync(
					sliderParams.Language,
					sliderParams.FolderPathAfterWwwroot,
					sliderDto.FileName,
					sliderDto.FileContentInBase64Str,
					FileTypes.Slider);
	
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
				throw new ExceptionWithMessage(
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
				throw new ExceptionWithMessage(
					parameters.Get<Int16>("StatusCode"),
					parameters.Get<string>("ErrorCode"),
					parameters.Get<string>("ErrorDescription"),
					parameters.Get<string>("ErrorMessage"));
			#endregion

			return sliderPath;
		}

		public async Task DeleteMultipleSliderAsync(
			SliderParametersForDeleteMultiple sliderParams,
			SliderDtoForDeleteMultiple sliderDto)
		{
			#region delete from folder
			await _fileService.DeleteMultipleFileOnFolderAsync(
				sliderParams.Language,
				sliderParams.FolderPathAfterWwwroot,
				sliderDto.FileNamesToBeNotDelete);
			#endregion

			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add(
				"FileNamesToBeNotDeletedInString",
				sliderDto.ToString(),
				DbType.String);
			#endregion

			#region delete from db
			await _manager.FileRepository
				.DeleteMultipleSliderAsync(parameters);
			#endregion
		}

		public async Task DeleteOneSliderAsync(
			string language,
			string folderPathAfterWwwroot,
			string fileName)
		{
			#region delete from folder
			await _fileService.DeleteFileOnFolderByPathAsync(
				language,
				folderPathAfterWwwroot,
				fileName,
				FileTypes.Slider);
			#endregion			

			#region delete from db
			var parameters = new DynamicParameters();
			parameters.Add("FileName", fileName, DbType.String);

			await _manager.FileRepository
				.DeleteOneSliderAsync(parameters);
			#endregion
		}
	}
}