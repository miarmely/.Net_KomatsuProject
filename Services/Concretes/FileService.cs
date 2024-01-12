using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Entities.Enums;
using Entities.Exceptions;
using Org.BouncyCastle.Utilities.Encoders;
using Services.Contracts;


namespace Services.Concretes
{
	public class FileService : IFileService
	{
		private readonly IConfigManager _configs;

		public FileService(IConfigManager configs) =>
			_configs = configs;

		public async Task UploadFileToFolderAsync(
			string language,
			string folderPath,
			string fileName,
			string fileContentInBase64Str,
			FileTypes fileType)
		{
			#region set paths
			var fullFolderPath = await GetFullFolderPathAsync(folderPath);

			var fullFilePath = fullFolderPath
				+ @"\"
				+ fileName;
			#endregion

			#region upload file to folder (throw)

			#region decode file in base64
			var fileContentInBytes = Base64
				.Decode(fileContentInBase64Str);
			#endregion

			#region create file (throw)
			while (true)
			{
				try
				{
					#region create file
					await File.WriteAllBytesAsync(
						fullFilePath,
						fileContentInBytes);

					break;
					#endregion
				}
				catch (DirectoryNotFoundException ex)
				{
					#region create directory when directory not found
					Directory.CreateDirectory(fullFolderPath);
					#endregion
				}
				catch (Exception ex)
				{
					#region when other errors occured for "image" file (throw)
					if (fileType == FileTypes.Image)
						throw new ErrorWithCodeException(
							ErrorDetailsConfig.ToErrorDto(
								language,
								_configs.ErrorDetails.FiE_U_I));
					#endregion

					#region when other errors occured for "video" file (throw)
					if (fileType == FileTypes.Video)
						throw new ErrorWithCodeException(
							ErrorDetailsConfig.ToErrorDto(
								language,
								_configs.ErrorDetails.FiE_U_V));
					#endregion

					#region when other errors occured for "pdf" file (throw)
					if (fileType == FileTypes.Pdf)
						throw new ErrorWithCodeException(
							ErrorDetailsConfig.ToErrorDto(
								language,
								_configs.ErrorDetails.FiE_U_P));
					#endregion

					#region when other errors occured for "slider" file (throw)
					if (fileType == FileTypes.Slider)
						throw new ErrorWithCodeException(
							ErrorDetailsConfig.ToErrorDto(
								language,
								_configs.ErrorDetails.FiE_U_S));
					#endregion
				}
			}
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
				#region when directory not found
				return new string[0];  // return empty array;
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
			#region get paths
			var fullFilePathsOnDirectory = await GetFullFilePathsOnDirectoryAsync(
				language,
				folderPathAfterWwwroot);

			var fullFolderPath = await GetFullFolderPathAsync(folderPathAfterWwwroot);
			#endregion

			#region delete files on directory if not in "FileNamesToBeNotDelete"
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
			string language,
			string folderPathAfterWwwroot,
			string fileName,
			FileTypes fileType)
		{
			try
			{
				#region delete one file from folder
				var fullFolderPath = await GetFullFolderPathAsync(folderPathAfterWwwroot);

				File.Delete(fullFolderPath + "\\" + fileName);  // can be catch
				#endregion
			}
			catch (Exception ex)
			{
				#region when any error occured for "image" file (throw)
				if (fileType == FileTypes.Image)
					throw new ErrorWithCodeException(
						ErrorDetailsConfig.ToErrorDto(
							language,
							_configs.ErrorDetails.FiE_D_I));
				#endregion

				#region when any error occured for "video" file (throw)
				if (fileType == FileTypes.Image)
					throw new ErrorWithCodeException(
						ErrorDetailsConfig.ToErrorDto(
							language,
							_configs.ErrorDetails.FiE_D_V));
				#endregion

				#region when any error occured for "pdf" file (throw)
				else if (fileType == FileTypes.Pdf)
					throw new ErrorWithCodeException(
						ErrorDetailsConfig.ToErrorDto(
							language,
							_configs.ErrorDetails.FiE_D_P));
				#endregion

				#region when any error occured for "slider" file (throw)
				else if (fileType == FileTypes.Slider)
					throw new ErrorWithCodeException(
						ErrorDetailsConfig.ToErrorDto(
							language,
							_configs.ErrorDetails.FiE_D_S));
				#endregion
			}
		}

	}
}
