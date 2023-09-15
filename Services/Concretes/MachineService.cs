using AutoMapper;
using Entities.DtoModels;
using Entities.Exceptions;
using Entities.QueryModels;
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

		public MachineService(IRepositoryManager repository,
			IDtoConverterService dtoConverterService,
			IDataConverterService dataConverterService,
			IMapper mapper)
		{
			_manager = repository;
			_mapper = mapper;
			_dtoConverterService = dtoConverterService;
			_dataConverterService = dataConverterService;
		}

		public async Task CreateMachineAsync(MachineDtoForCreate machineDtoC)
		{
			#region convert machineDtoC to machineDto
			var machineDto = _mapper.Map<MachineDto>(machineDtoC);

			await ControlConflictErrorAsync(machineDto);

			machineDto.RegistrationDate = DateTime.UtcNow;
			#endregion

			#region convert machineDto to machine
			var machine = await _dataConverterService
				.MachineDtoToMachineAsync(machineDto);
			#endregion

			#region create machine
			_manager.MachineRepository
				.Create(machine);

			await _manager.SaveAsync();
			#endregion
		}

		public async Task<IEnumerable<MachineDto>> GetAllMachinesWithPagingAsync(
			PagingParameters paginationParameters,
			HttpResponse response,
			bool trackChanges = false)
		{
			#region get machines (throw)
			var machines = await _manager.MachineRepository
				.GetAllMachinesAsync(paginationParameters);

			// when not found
			if (machines.Count == 0)
				throw new ErrorWithCodeException(404,
					"NF-M",
					"Not Found - Machine");
			#endregion

			#region add pagination infos to headers
			response.Headers.Add(
				"Machine-Pagination",
				machines.GetMetaDataForHeaders());
			#endregion

			#region convert machine to machineDto
			var machineDtoList = await _dtoConverterService
				.MachineToMachineDtoAsync(machines);
			#endregion

			return machineDtoList;
		}

		public async Task<IEnumerable<MachineDto>> GetMachinesByConditionWithPagingAsync(
			MachineDtoForDisplay machineDtoD,
			PagingParameters pagingParameters,
			HttpResponse response)
		{
			#region set brandId
			int? brandId = null;

			// when brandName entered
			if (machineDtoD.BrandName != null)
			{
				#region get brand (throw)
				var brand = await _manager.BrandRepository
					.GetBrandByNameAsync(machineDtoD.BrandName);
				
				// when not found
				if (brand == null)
					throw new ErrorWithCodeException(404,
						"VE-M-B",
						"Verification Error - Machine - Brand");
				#endregion

				brandId = brand.Id;
			}
			#endregion

			#region get categoryId
			int? categoryId;

			#region when subCategoryName entered
			if (machineDtoD.SubCategoryName != null)
			{
				#region get category (throw)
				var category = await _manager.CategoryRepository
					.GetCategoryBySubCategoryNameAsync(machineDtoD.BrandName);

				// when not found
				if (category == null)
					throw new ErrorWithCodeException(404,
						"VE-M-C",
						"Verification Error - Machine - Category");
				#endregion

				categoryId = category.Id;
			}
			#endregion

			#region when subCategoryName didn't enter
			else
			{
				#region when mainCategory entered
				if (machineDtoD.MainCategoryName != null)
				{
					#region get mainCategory
					var mainCategory = await _manager.MainCategoryRepository
						.GetMainCategoryByNameAsync(machineDtoD.MainCategoryName);

					// when not found
					if (mainCategory == null)
						throw new ErrorWithCodeException(404,
							"VE-M-M",
							"Verification Error - Machine - MainCategory");
					#endregion

					#region get category
					var categories = await _manager.CategoryRepository
						.GetCategoriesByMainCategoryIdAsync(mainCategory.Id);

					// when not found
					if (categories == null)
						throw new ErrorWithCodeException(404,
							"VE-M-C",
							"Verification Error - Machine - Category");

					// get first category on list
					var category = categories.First(c => true);
					#endregion

					categoryId = category.Id;
				}
				#endregion

				#region when mainCategory didn't enter
				else
					categoryId = null;
				#endregion
			}
			#endregion
		
			#endregion

			#region get machines(throw)
			var machines = await _manager.MachineRepository
				.GetMachinesByConditionAsync(pagingParameters, m =>
					#region BrandName
						(machineDtoD.BrandName == null ?
							true
							: m.BrandId == brandId)
					#endregion
					#region CategoryId
						&& (categoryId == null ?
							true
							: m.CategoryId == categoryId)
					#endregion
					#region Model
						&& (machineDtoD.Model == null ?
							true
							: m.Model == machineDtoD.Model)
					#endregion
					#region IsSecondHand
						&& (machineDtoD.IsSecondHand == null ?
							true
							: m.IsSecondHand == machineDtoD.IsSecondHand)
					#endregion
					#region SoldOrRentedStatus
						&& (machineDtoD.SoldOrRentedStatus == null ?
							true
							: machineDtoD.SoldOrRentedStatus.Equals("sold") ?
								m.Sold > 0
								: m.Rented > 0) // SoldOrRentedStatus = "rented"
					#endregion
					#region Year
						&& machineDtoD.Year == null ?
							true
							: m.Year == machineDtoD.Year);
			#endregion

			// when not found
			if (machines.Count == 0)
				throw new ErrorWithCodeException(404,
					"NF-M",
					"Not Found - Machine");
			#endregion

			#region add pagination infos to headers
			response.Headers.Add(
				"Machine-Pagination",
				machines.GetMetaDataForHeaders());
			#endregion

			#region convert machine to machineDto
			var machineDtoList = await _dtoConverterService
				.MachineToMachineDtoAsync(machines);
			#endregion

			return machineDtoList;
		}

		public async Task<IEnumerable<string>> GetSubCategoriesOfMainCategoryAsync(
			string mainCategoryName)
		{
			#region get mainCategory (throw)
			var mainCategory = await _manager.MainCategoryRepository
				.GetMainCategoryByNameAsync(mainCategoryName);

			// when not found
			if (mainCategory == null)
				throw new ErrorWithCodeException(404,
					"VE-M-M",
					"Not Found - Machine - Main Category");
			#endregion

			#region get subCategories
			var categories = await _manager.CategoryRepository
				.GetCategoriesByMainCategoryIdAsync(mainCategory.Id);

			var subCategories = categories.Select(c => c.SubCategoryName);
			#endregion

			return subCategories;
		}


		#region private
		private async Task ControlConflictErrorAsync(MachineDto machineDto)
		{
			#region get category
			var category = await _manager.CategoryRepository
				.GetCategoryBySubCategoryNameAsync(machineDto.SubCategoryName);
			
			// when not found
			if (category == null)
				throw new ErrorWithCodeException(404,
					"VE-M-S",
					"Verification Error - Machine - Sub Category");
			#endregion

			#region get entity matched same categoryId and model
			var machines = await _manager.MachineRepository
				.GetMachinesByConditionAsync(m =>
					m.CategoryId == category.Id
					&& m.Model.Equals(machineDto.Model));
			#endregion

			#region throw conflict error
			if (machines.Count != 0)
				throw new ErrorWithCodeException(409,
					"CE-M-M",
					"Conflict Error - Machine - Model");
			#endregion
		}
		#endregion
	}
}
