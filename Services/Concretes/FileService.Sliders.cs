using Dapper;
using Entities.DtoModels.SliderDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Org.BouncyCastle.Utilities.Encoders;
using System.Data;


namespace Services.Concretes
{
	public partial class FileService
	{
		public async Task UploadSliderToFolderAsync(
			SliderParametersForUploadToFolder sliderParams,
			SliderDtoForUploadToFolder sliderDto)
		{
			#region set paths
			var fullFolderPath = await GetFullFolderPathAsync(
				sliderParams.FolderPathAfterWwwroot);

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
			SliderParametersForDeleteMultiple sliderParams,
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

		public async Task DeleteOneSliderAsync(
			string language,
			string folderPathAfterWwwroot, 
			string fileName)
		{
			#region delete from folder
			try
			{
				await DeleteFileOnFolderByPathAsync(folderPathAfterWwwroot, fileName);
			}
			catch (Exception ex)
			{
				#region when any error occured (throw)
				throw new ErrorWithCodeException(
					_configs.ErrorDetails.ConvertToErrorDto(
						language,
						_configs.ErrorDetails.NF_S_FP));
				#endregion
			}
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