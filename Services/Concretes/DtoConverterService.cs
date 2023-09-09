using Entities.DataModels;
using Entities.DtoModels;
using Repositories.Contracts;
using Services.Contracts;
using System.Collections.ObjectModel;

namespace Services.Concretes
{
    public class DtoConverterService : IDtoConverterService
	{
		private readonly IRepositoryManager _manager;

		public DtoConverterService(IRepositoryManager repository) =>
			_manager = repository;

		public async Task<List<MachineDto>> MachineToMachineDtoAsync(List<Machine> machineList) =>
			await Task.Run(async () =>
			{
				#region set machineDtoList
				var machineDtoList = new List<MachineDto>();

				foreach (var machine in machineList)
				{
					#region set brand
					var brand = await _manager.BrandRepository
						.GetBrandByIdAsync(machine.BrandId);
					#endregion

					#region set mainCategory
					var mainCategory = await _manager.MainCategoryRepository
						.GetMainCategoryByIdAsync(machine.MainCategoryId);
					#endregion

					machineDtoList.Add(new MachineDto
					{
						BrandName = brand.Name,
						MainCategoryName = mainCategory.Name,
						SubCategoryName = machine.SubCategoryName,
						Model = machine.Model,
						IsSecondHand = machine.IsSecondHand ? true : false,
						ImagePath = machine.ImagePath,
						Stock = machine.Stock,
						Rented = machine.Rented,
						Sold = machine.Sold,
						Year = machine.Year,
						RegistrationDate = machine.RegistrationDate
					});
				}
				#endregion

				return machineDtoList;
			});

		public async Task<MachineDto> MachineToMachineDtoAsync(Machine machine)
		{
			#region set brand
			var brand = await _manager.BrandRepository
				.GetBrandByIdAsync(machine.BrandId);
			#endregion

			#region set mainCategory
			var mainCategory = await _manager.MainCategoryRepository
				.GetMainCategoryByIdAsync(machine.MainCategoryId);
			#endregion

			return new MachineDto
			{
				BrandName = brand.Name,
				MainCategoryName = mainCategory.Name,
				SubCategoryName = machine.SubCategoryName,
				Model = machine.Model,
				IsSecondHand = machine.IsSecondHand ? true : false,
				ImagePath = machine.ImagePath,
				Stock = machine.Stock,
				Rented = machine.Rented,
				Sold = machine.Sold,
				Year = machine.Year,
				RegistrationDate = machine.RegistrationDate
			};
		}

		public async Task<ICollection<UserDto>> UserToUserDtoAsync(List<User> users) =>
			await Task.Run(async () =>
			{
				#region set userDtos collection
				var userDtos = new Collection<UserDto>();

				foreach (var user in users)
				{
					#region get company and userAndRoles
					var company = await _manager.CompanyRepository
						.GetCompanyByIdAsync(user.CompanyId);

					var userAndRoles = await _manager.UserAndRoleRepository
						.GetUserAndRolesByUserIdAsync(user.Id);
					#endregion

					#region set roleNames collection
					var roleNames = new Collection<string>();

					foreach (var userAndRole in userAndRoles)
					{
						var role = await _manager.RoleRepository
							.GetRoleByIdAsync(userAndRole.RoleId);

						roleNames.Add(role.Name);
					}
					#endregion

					userDtos.Add(new UserDto
					{
						Id = user.Id,
						FirstName = user.FirstName,
						LastName = user.LastName,
						CompanyName = company.Name,
						TelNo = user.TelNo,
						Email = user.Email,
						Password = user.Password,
						RoleNames = roleNames
					});
				}
				#endregion

				return userDtos;
			});
	}
}
