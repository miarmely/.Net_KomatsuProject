using Entities.DataModels;
using Entities.DtoModels;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Repositories.Contracts;
using Services.Contracts;
using System.ComponentModel.DataAnnotations.Schema;

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
				#region convert machine to machineDto then add machineDtoList
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

		public async Task<List<Machine>> MachineDtoToMachineAsync(List<MachineDto> machineDtoList)
		{
			var machineList = new List<Machine>();

			foreach (var machineDto in machineDtoList)
			{

				machineList(new Machine
				{
					BrandId
					MainCategoryId
					SubCategoryName
					Model
					IsSecondHand
					ImagePath
					Stock
					Rented
					Sold
					Year
					RegistrationDate
					IsDeleted
				}

			}
		}
	}
}
