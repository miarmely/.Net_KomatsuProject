namespace Services.Contracts
{
	public interface IFileService
	{
		Task<byte[]> ConvertFileToByte(string filePath);
	}
}
