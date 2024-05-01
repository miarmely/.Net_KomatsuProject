using Entities.MiarLibrary.DtoModels;


namespace Services.MiarLibrary.Contracts
{
    public interface IPasswordService
    {
		Task UpdatePasswordAsync(PasswordDtoForUpdate passwordDto);
	}
}
