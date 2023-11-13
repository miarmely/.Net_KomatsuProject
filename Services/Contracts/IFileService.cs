using Entities.DtoModels;

namespace Services.Contracts
{
	public interface IFileService
	{
		Task<byte[]> ConvertFileToByteAsync(string filePath);
		Task UploadSliderImageAsync(ImageFileDto imageFileDto);
    }
}
