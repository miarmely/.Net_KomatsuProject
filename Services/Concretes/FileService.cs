using Entities.ConfigModels.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
	public class FileService : IFileService
	{
		private readonly IConfigManager _config;

		public FileService(IConfigManager config) =>
			_config = config;
		
		public async Task<byte[]> ConvertFileToByte(string filePath)
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
	}
}
