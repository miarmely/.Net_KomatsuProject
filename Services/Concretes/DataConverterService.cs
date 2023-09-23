using Entities.DataModels;
using Entities.DtoModels;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class DataConverterService : IDataConverterService
	{
		private readonly IRepositoryManager _manager;

		public DataConverterService(IRepositoryManager repository) =>
			_manager = repository;
		
	//	public async Task<List<Machine>> MachineDtoToMachineAsync(List<MachineDto> machineDtoList) =>
	//		await Task.Run(async () =>
	//		{
	//			#region set machineList
	//			var machineList = new List<Machine>();

	//			foreach (var machineDto in machineDtoList)
	//			{
	//				#region set data
	//				var brand = await _manager.BrandRepository
	//					.GetBrandByNameAsync(machineDto.BrandName);

	//				var category = await _manager.CategoryRepository
	//					.GetCategoryBySubCategoryNameAsync(machineDto.SubCategoryName);
	//				#endregion

	//				machineList.Add(new Machine
	//				{
	//					BrandId = brand.Id,
	//					CategoryId = category.Id,
	//					Model = machineDto.Model,
	//					HandStatus = (int)machineDto.ZerothHandOrSecondHand,
	//					ImagePath = machineDto.ImagePath,
	//					Stock = (int)machineDto.Stock,
	//					Rented = (int)machineDto.Rented,
	//					Sold = (int)machineDto.Sold,
	//					Year = (int)machineDto.Year,
	//					CreatedAt = (DateTime)machineDto.CreatedAt,
	//					IsDeleted = false
	//				});
	//			}
	//			#endregion

	//			return machineList;
	//		});

	//	public async Task<Machine> MachineDtoToMachineAsync(MachineDto machineDto)
	//	{
	//		#region set brand
	//		var brand = await _manager.BrandRepository
	//			.GetBrandByNameAsync(machineDto.BrandName);

	//		#region create brand if isn't exits on database
	//		if (brand == null)
	//		{
	//			brand = new Brand
	//			{
	//				Name = machineDto.BrandName
	//			};

	//			_manager.BrandRepository.Create(brand);
	//			await _manager.SaveAsync();
	//		}
	//		#endregion

	//		#endregion

	//		#region set mainCategory
	//		var category = await _manager.CategoryRepository
	//			.GetCategoryBySubCategoryNameAsync(machineDto.SubCategoryName);
	//		#endregion

	//		return new Machine
	//		{
	//			BrandId = brand.Id,
	//			Model = machineDto.Model,
	//			CategoryId = category.Id,
	//			HandStatus = (int)machineDto.ZerothHandOrSecondHand,
	//			ImagePath = machineDto.ImagePath,
	//			Stock = (int)machineDto.Stock,
	//			Rented = machineDto.Rented ?? 0,
	//			Sold = machineDto.Sold ?? 0,
	//			Year = (int)machineDto.Year,
	//			CreatedAt = (DateTime)machineDto.CreatedAt,
	//			IsDeleted = false
	//		};
	//	}
	}	
}
