using Entities.DataModels;
using Entities.DtoModels;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
	public class DtoConverterService : IDtoConverterService
	{
		private readonly IRepositoryManager _repository;

		public DtoConverterService(IRepositoryManager repository) =>
			_repository = repository;

		public async Task<List<MachineDto>> MachineToMachineDtoAsync(List<Machine> machineList) =>
			await Task.Run(async () =>
			{
				#region set machineDtoList
				var machineDtoList = new List<MachineDto>();

				foreach (var machine in machineList)
				{
					#region set brand
					var brand = await _repository.BrandRepository
						.GetBrandByIdAsync(machine.BrandId);
					#endregion

					#region set mainCategory
					var mainCategory = await _repository.MainCategoryRepository
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
			var brand = await _repository.BrandRepository
				.GetBrandByIdAsync(machine.BrandId);
			#endregion

			#region set mainCategory
			var mainCategory = await _repository.MainCategoryRepository
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

		public async Task<List<Machine>> MachineDtoToMachineAsync(List<MachineDto> machineDtoList) =>
			await Task.Run(async () =>
			{
				#region set machineList
				var machineList = new List<Machine>();

				foreach (var machineDto in machineDtoList)
				{
					#region set properties
					var brand = await _repository.BrandRepository
						.GetBrandByNameAsync(machineDto.BrandName);

					var mainCategory = await _repository.MainCategoryRepository
						.GetMainCategoryByNameAsync(machineDto.MainCategoryName);
					#endregion

					machineList.Add(new Machine
					{
						BrandId = brand.Id,
						MainCategoryId = mainCategory.Id,
						SubCategoryName = machineDto.SubCategoryName,
						Model = machineDto.Model,
						IsSecondHand = machineDto.IsSecondHand,
						ImagePath = machineDto.ImagePath,
						Stock = (int)machineDto.Stock,
						Rented = (int)machineDto.Rented,
						Sold = (int)machineDto.Sold,
						Year = (int)machineDto.Year,
						RegistrationDate = (DateTime)machineDto.RegistrationDate,
						IsDeleted = false
					});
				}
				#endregion

				return machineList;
			});

		public async Task<Machine> MachineDtoToMachineAsync(MachineDto machineDto)
		{
			#region set brand
			var brand = await _repository.BrandRepository
				.GetBrandByNameAsync(machineDto.BrandName);

			#region create brand if isn't exits on database
			if (brand == null)
			{
				brand = new Brand
				{
					Name = machineDto.BrandName
				};

				_repository.BrandRepository.Create(brand);
				await _repository.SaveAsync();
			}
			#endregion 

			#endregion

			#region set mainCategory
			var mainCategory = await _repository.MainCategoryRepository
				.GetMainCategoryByNameAsync(machineDto.MainCategoryName);
			#endregion

			return new Machine
			{
				BrandId = brand.Id,
				MainCategoryId = mainCategory.Id,
				SubCategoryName = machineDto.SubCategoryName,
				Model = machineDto.Model,
				IsSecondHand = machineDto.IsSecondHand,
				ImagePath = machineDto.ImagePath,
				Stock = (int)machineDto.Stock,
				Rented = (int)machineDto.Rented,
				Sold = (int)machineDto.Sold,
				Year = (int)machineDto.Year,
				RegistrationDate = (DateTime)machineDto.RegistrationDate,
				IsDeleted = false
			};
		}
	}
}
