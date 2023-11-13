using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Org.BouncyCastle.Utilities.Encoders;
using Services.Contracts;

namespace Services.Concretes
{
	public class FileService : IFileService
	{
		private readonly IConfigManager _config;

		public FileService(IConfigManager config) =>
			_config = config;
		
		public async Task<byte[]> ConvertFileToByteAsync(string filePath)
		{
			int MaxChunkSizeInBytes = _config.FileServiceSettings.MaxChunkSizeInBytes;
			byte[] fileByteArray;
			
			#region convert file to byteArary
			using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
			{
				var chunkedFileByteArray = new byte[MaxChunkSizeInBytes];
				int totalBytesRead = 0;
				int bytesRead;

				#region set fileByteArray size
				while ((bytesRead = await stream
					.ReadAsync(chunkedFileByteArray, 0, MaxChunkSizeInBytes)) != 0)
					totalBytesRead += bytesRead;
				#endregion

				#region write bytes to FileByteArray
				stream.Seek(0, SeekOrigin.Begin);  // set cursor to begin.

				fileByteArray = new byte[totalBytesRead];
				await stream.ReadAsync(fileByteArray, 0, totalBytesRead);
				#endregion
			}
			#endregion

			return fileByteArray;
		}

        public async Task UploadSliderImageAsync(ImageFileDto imageFileDto)
		{
            #region set path of slider folder
            // remove "Temsa_Api" path and add "Temsa_Web/..." path
            var filePath = Directory
                .GetCurrentDirectory()
                .Replace(
					"Temsa_Api",
                    $"Temsa_Web\\wwwroot\\images\\sliders\\{imageFileDto.FileName}");
            #endregion

            #region upload images to specified path
            var contentInBytes = Base64.Decode(imageFileDto.ContentInBase64Str);

            await File.WriteAllBytesAsync(filePath, contentInBytes);
            #endregion
        }
    }
}
