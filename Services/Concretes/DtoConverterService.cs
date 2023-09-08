using Entities.DataModels;
using Entities.DtoModels.Machine;
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
	}
}
