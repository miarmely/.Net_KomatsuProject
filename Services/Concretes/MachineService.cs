using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.EnumModels;
using Entities.DtoModels.QueryModels;
using Entities.Exceptions;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories.Contracts;
using Services.Contracts;


namespace Services.Concretes
{
    public class MachineService : IMachineService
	{
		private readonly IRepositoryManager _manager;
		private readonly IDtoConverterService _dtoConverterService;
		private readonly IDataConverterService _dataConverterService;
		private readonly IMapper _mapper;

		public MachineService(
			IRepositoryManager repository,
			IDtoConverterService dtoConverterService,
			IDataConverterService dataConverterService,
			IMapper mapper)
		{
			_manager = repository;
			_mapper = mapper;
			_dtoConverterService = dtoConverterService;
			_dataConverterService = dataConverterService;
		}

		//public async Task CreateMachineAsync(MachineBodyDtoForCreate machineDtoC)
		//{
		//	#region convert machineDtoC to machineDto
		//	var machineDto = _mapper.Map<MachineDto>(machineDtoC);

		//	// control conflict error
		//	await ControlConflictErrorAsync(
		//		machineDto.Model, 
		//		machineDto.SubCategoryName);

		//	machineDto.CreatedAt = DateTime.UtcNow;
		//	#endregion

		//	#region convert machineDto to machine
		//	var machine = await _dataConverterService
		//		.MachineDtoToMachineAsync(machineDto);

		//	machine.ImagePath = $"{machine.Model}.jpg";
		//	#endregion

		//	#region create machine
		//	_manager.MachineRepository
		//		.Create(machine);

		//	await _manager.SaveAsync();
		//	#endregion
		//}

		//public async Task<IEnumerable<MachineDto>> GetAllMachinesWithPagingAsync(
		//	PaginationQueryDto paginationParameters,
		//	HttpResponse response)
		//{
		//	#region get machines (throw)
		//	var machines = await _manager.MachineRepository
		//		.GetAllMachinesAsync(paginationParameters);

		//	//when not found
  //          if (machines.Count == 0)
		//		throw new ErrorWithCodeException(404,
		//			"NF-M",
		//			"Not Found - Machine");
		//	#endregion

		//	#region add pagination infos to headers
		//	response.Headers.Add(
		//		"Machine-Pagination",
		//		machines.GetMetaDataForHeaders());
		//	#endregion

		//	#region convert machine to machineDto
		//	var machineDtoList = await _dtoConverterService
		//		.MachineToMachineDtoAsync(machines);
		//	#endregion

		//	return machineDtoList;
		//}

		//public async Task<IEnumerable<MachineDto>> GetMachinesByConditionWithPagingAsync(
		//	MachineBodyDtoForDisplay machineDtoD,
		//	PaginationQueryDto pagingParameters,
		//	HttpResponse response)
		//{
		//	#region set brandId
		//	int? brandId = null;

		//	// when brandName entered
		//	if (machineDtoD.BrandName != null)
		//	{
		//		#region get brand (throw)
		//		var brand = await _manager.BrandRepository
		//			.GetBrandByNameAsync(machineDtoD.BrandName);

		//		// when not found
		//		if (brand == null)
		//			throw new ErrorWithCodeException(404,
		//				"VE-M-B",
		//				"Verification Error - Machine - Brand");
		//		#endregion

		//		brandId = brand.Id;
		//	}
		//	#endregion

		//	#region get categoryId
		//	int? categoryId = null;
		//	IEnumerable<Category>? categories = null;
		//	IEnumerable<int>? categoryIdList = null;

		//	#region when mainCategoryName entered
		//	if (machineDtoD.MainCategoryName != null)
		//	{
		//		#region get mainCategory (throw)
		//		var mainCategory = await _manager.MainCategoryRepository
		//			.GetMainCategoryByNameAsync(machineDtoD.MainCategoryName);

		//		// when mainCategoryName not found
		//		if (mainCategory == null)
		//			throw new ErrorWithCodeException(404,
		//				"VE-M-M",
		//				"Verification Error - Machine - MainCategory");
		//		#endregion

		//		#region set categories and categoryIdList
		//		categories = await _manager.CategoryRepository
		//			.GetCategoriesByMainCategoryIdAsync(mainCategory.Id);

		//		categoryIdList = categories.Select(c => c.Id);
		//		#endregion
		//	}
		//	#endregion

		//	#region when subCategoryName entered
		//	if (machineDtoD.SubCategoryName != null)
		//	{
		//		Category? category;

		//		#region when mainCategoryName entered (search in categories)
		//		if (categoryIdList != null)
		//			category = categories.SingleOrDefault(c =>
		//				c.SubCategoryName.Equals(machineDtoD.SubCategoryName));
		//		#endregion

		//		#region when mainCategoryName didn't enter (search in database again)
		//		else
		//			category = await _manager.CategoryRepository
		//				.GetCategoryBySubCategoryNameAsync(machineDtoD.SubCategoryName);
		//		#endregion

		//		#region when subCategoryName not found (throw)
		//		if (category == null)
		//			throw new ErrorWithCodeException(404,
		//				"VE-M-S",
		//				"Verification Error - Machine - SubCategoryName");
		//		#endregion

		//		categoryId = category.Id;
		//	}
		//	#endregion

		//	#endregion

		//	#region get machines (throw)
		//	var machines = await _manager.MachineRepository
		//		.GetMachinesByConditionAsync(pagingParameters, m =>
		//		#region BrandName
		//			(machineDtoD.BrandName == null ?
		//				true
		//				: m.BrandId == brandId)
		//		#endregion
		//		#region CategoryId

		//		#region MainCategoryName
		//			&& (machineDtoD.MainCategoryName == null ?
		//				true
		//				: categoryIdList.Contains(m.CategoryId))
		//		#endregion
		//		#region SubCategoryName
		//			&& (machineDtoD.SubCategoryName == null ?
		//				true
		//				: m.CategoryId == categoryId)
		//		#endregion

		//		#endregion
		//		#region Model
		//			&& (machineDtoD.Model == null ?
		//				true
		//				: m.Model.Equals(machineDtoD.Model))
		//		#endregion
		//		#region HandStatus
		//			&& (machineDtoD.ZerothHandOrSecondHand == null ?
		//				true
		//				: m.HandStatus == (int)machineDtoD.ZerothHandOrSecondHand)
		//		#endregion
		//		#region SoldOrRented
		//			&& (machineDtoD.SoldOrRented == null ?
		//				true
		//				: machineDtoD.SoldOrRented == UsageStatus.Sold ?
		//					m.Sold > 0
		//					: m.Rented > 0) // ... == UsageStatus.Rented
		//		#endregion
		//		#region Year
		//			&& (machineDtoD.Year == null ?
		//				true
		//				: m.Year == machineDtoD.Year));
		//	#endregion

		//	// when not found
		//	if (machines.Count == 0)
		//		throw new ErrorWithCodeException(404,
		//			"NF-M",
		//			"Not Found - Machine");
		//	#endregion

		//	#region add pagination infos to headers
		//	response.Headers.Add(
		//		"Machine-Pagination",
		//		machines.GetMetaDataForHeaders());
		//	#endregion

		//	#region convert machine to machineDto
		//	var machineDtoList = await _dtoConverterService
		//		.MachineToMachineDtoAsync(machines);
		//	#endregion

		//	return machineDtoList;
		//}

		//public async Task<IEnumerable<string>> GetSubCategoriesOfMainCategoryAsync(
		//	string mainCategoryName)
		//{
		//	#region get mainCategory (throw)
		//	var mainCategory = await _manager.MainCategoryRepository
		//		.GetMainCategoryByNameAsync(mainCategoryName);

		//	// when not found
		//	if (mainCategory == null)
		//		throw new ErrorWithCodeException(404,
		//			"VE-M-M",
		//			"Not Found - Machine - Main Category");
		//	#endregion

		//	#region get categories
		//	var categories = await _manager.CategoryRepository
		//		.GetCategoriesByMainCategoryIdAsync(mainCategory.Id);
		//	#endregion

		//	#region get subCategories (throw)
		//	var subCategories = categories.Select(c => c.SubCategoryName);

		//	// when subCategories not found
		//	if (subCategories.Count() == 0)
		//		throw new ErrorWithCodeException(404,
		//			"VE-M-S",
		//			"Not Found - Machine - SubCategory");
		//	#endregion

		//	return subCategories;
		//}

		//public async Task UpdateMachineAsync(
		//	MachineQueryDtoForUpdate machineQueryDto,
		//	MachineBodyDtoForUpdate machineBodyDto)
		//{
		//	#region control conflict error (throw)

		//	#region set subCategoryName
		//	var subCategoryName = machineBodyDto.SubCategoryName ??
		//		machineQueryDto.SubCategoryName;
  //          #endregion

  //          #region get category of machineQueryDto
  //          var categoryForConflictError = await _manager.CategoryRepository
		//		.GetCategoryBySubCategoryNameAsync(subCategoryName);

		//	// when subCategory not found
		//	if (categoryForConflictError == null)
		//		throw new ErrorWithCodeException(404,
		//			"VE-M-S",
		//			"Verification Error - Machine - SubCategory");
  //          #endregion

  //          #region control conflict error (throw)
  //          await ControlConflictErrorAsync(
  //              machineBodyDto.Model,
  //              category: categoryForConflictError);
  //          #endregion

  //          #endregion

  //          #region get category of machineBodyDto
  //          var categoryForGetMachine = await _manager.CategoryRepository
		//		.GetCategoryBySubCategoryNameAsync(machineQueryDto.SubCategoryName);
  //          #endregion

  //          #region get machine
  //          var machine = await _manager.MachineRepository
		//		.GetMachineByCategoryIdAndModelAsync(
  //                  categoryForGetMachine.Id, 
		//			machineQueryDto.Model);

		//	// when model not found
		//	if (machine == null)
		//		throw new ErrorWithCodeException(404,
		//			"VE-M-Mo",
		//			"Verifiction Error - Machine - Model");
		//	#endregion

		//	#region get brand if changed (throw)
		//	Brand? brand = null;

		//	if (machineBodyDto.BrandName != null)
		//		brand = await GetBrandOrCreateIfNotExistsAsync(machineBodyDto.BrandName);
		//	#endregion

		//	#region get category if subCategoryName changed (throw)
		//	Category? category = null;

		//	if (machineBodyDto.SubCategoryName != null)
		//	{
		//		category = await _manager.CategoryRepository
		//			.GetCategoryBySubCategoryNameAsync(machineBodyDto.SubCategoryName);

		//		// when subCategory not found
		//		if (category == null)
		//			throw new ErrorWithCodeException(404,
		//				"VE-M-S",
		//				"Verification Error - Machine - SubCategory");
		//	}
		//	#endregion

		//	#region set machine
		//	machine.BrandId = brand == null ?
		//		machine.BrandId
		//		: brand.Id;

		//	machine.CategoryId = category == null ?
		//		machine.CategoryId
		//		: category.Id;

		//	machine.Model = machineBodyDto.Model == null ?
		//		machine.Model
		//		: machineBodyDto.Model;

		//	machine.HandStatus = machineBodyDto.ZerothHandOrSecondHand == null ?
		//		machine.HandStatus
		//		: (int)machineBodyDto.ZerothHandOrSecondHand;

		//	machine.ImagePath = machineBodyDto.ImagePath == null ?
		//		machine.ImagePath
		//		: machineBodyDto.ImagePath;

		//	machine.Stock = machineBodyDto.Stock == null ?
		//		machine.Stock
		//		: (int)machineBodyDto.Stock;

		//	machine.Rented = machineBodyDto.Rented == null ?
		//		machine.Rented
		//		: (int)machineBodyDto.Rented;

		//	machine.Sold = machineBodyDto.Sold == null ?
		//		machine.Sold
		//		: (int)machineBodyDto.Sold;

		//	machine.Year = machineBodyDto.Year == null ?
		//		machine.Year
		//		: (int)machineBodyDto.Year;
		//	#endregion

		//	#region update machine
		//	_manager.MachineRepository
		//		.Update(machine);

		//	await _manager.SaveAsync();
		//	#endregion
		//}

		//public async Task DeleteMachinesAsync(MachineBodyDtoForDelete machineBodyDto)
		//{
		//	#region delete machines (throw)
		//	await Task.Run(async () =>
		//	{
		//		foreach (var machineInfo in machineBodyDto.MachineInfos)
		//		{
		//			#region get category (throw)
		//			var category = await _manager.CategoryRepository
		//				.GetCategoryBySubCategoryNameAsync(machineInfo.SubCategoryName);

		//			// when subCategoryName not found
		//			if (category == null)
		//				throw new ErrorWithCodeException(404,
		//					"VE-M-S",
		//					"Verification Error - Machine - SubCategory");
		//			#endregion

		//			#region get machine (throw)
		//			var machine = await _manager.MachineRepository
		//				.GetMachineByCategoryIdAndModelAsync(
		//					category.Id, 
		//					machineInfo.Model);

		//			// when model not found
		//			if (machine == null)
		//				throw new ErrorWithCodeException(404,
		//					"VE-M-Mo",
		//					"Verification Error - Machine - Model");
		//			#endregion

		//			_manager.MachineRepository
		//				.Delete(machine);
		//		}
		//	});

		//	await _manager.SaveAsync();
		//	#endregion
		//}


  //      #region private
  //      private async Task ControlConflictErrorAsync(
		//	string model, 
		//	string subCategoryName = null,
		//	Category category = null)
		//{
		//	#region get category if category null (throw)
		//	if (category == null)
		//	{
		//		#region get category (throw)
		//		category = await _manager.CategoryRepository
		//			.GetCategoryBySubCategoryNameAsync(subCategoryName);

		//		// when not found
		//		if (category == null)
		//			throw new ErrorWithCodeException(404,
		//				"VE-M-S",
		//				"Verification Error - Machine - Sub Category");
		//		#endregion
		//	}
		//	#endregion

		//	#region control conflict error 
		//	var machines = await _manager.MachineRepository
		//		.GetMachinesByConditionAsync(m =>
		//			m.CategoryId == category.Id
		//			&& m.Model.Equals(model));

		//	// when same model of category is already exists
		//	if (machines.Count != 0)
		//		throw new ErrorWithCodeException(409,
		//			"CE-M-Mo",
		//			"Conflict Error - Machine - Model");
		//	#endregion
		//}

		//private async Task<Brand> GetBrandOrCreateIfNotExistsAsync(string brandName)
		//{
  //          #region get brand
  //          var brand = await _manager.BrandRepository
		//		.GetBrandByNameAsync(brandName);
		//	#endregion

		//	#region create brand if not exists
		//	if (brand == null)
		//	{
		//		brand = new Brand
  //              {
  //                  Name = brandName
  //              };

  //              _manager.BrandRepository
		//			.Create(brand);

		//		await _manager.SaveAsync();
		//	}
		//	#endregion

		//	return brand;
  //      }
  //      #endregion
    }
}
