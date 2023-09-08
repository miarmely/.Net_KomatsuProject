using AutoMapper;
using Entities.DtoModels;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class MachineService : IMachineService
	{
		private readonly IRepositoryManager _repository;
		private readonly IDtoConverterService _dtoConverterService;
		private readonly IDataConverterService _dataConverterService;
		private readonly IMapper _mapper;

		public MachineService(IRepositoryManager repository,
			IDtoConverterService dtoConverterService,
			IDataConverterService dataConverterService,
			IMapper mapper)
		{
			_repository = repository;
			_dtoConverterService = dtoConverterService;
			_mapper = mapper;
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
			_repository.MachineRepository
				.Create(machine);

			await _repository.SaveAsync();
			#endregion
		}

		public async Task<List<MachineDto>> GetMachinesByConditionAsync(
			MachineDtoForSearch machineDtoS)
		{
			#region set brand if entered
			var brand = machineDtoS.BrandName == null ?
				null
				: await _repository.BrandRepository
					.GetBrandByNameAsync(machineDtoS.BrandName);
			#endregion

			#region set mainCategory if entered
			var mainCategory = machineDtoS.MainCategoryName == null ?
				null
				: await _repository.MainCategoryRepository
					.GetMainCategoryByNameAsync(machineDtoS.MainCategoryName);
			#endregion

			#region get machines
			var machines = await _repository.MachineRepository
				.GetMachinesByConditionAsync(m =>
				#region brand
					(brand == null ?
						true
						: m.BrandId == brand.Id)
				#endregion
				#region mainCategory
					&& (mainCategory == null ?
						true
						: m.MainCategoryId == mainCategory.Id)
				#endregion
				#region SubCategoryName
					&& (machineDtoS.SubCategoryName == null ?
						true
						: m.SubCategoryName.Equals(machineDtoS.SubCategoryName))
				#endregion
				#region Model
					&& (machineDtoS.Model == null ?
						true
						: m.Model.Equals(machineDtoS.Model))
				#endregion
				#region IsSecondHand
					&& (machineDtoS.IsSecondHand == null ?
						true
						: m.IsSecondHand == machineDtoS.IsSecondHand)
				#endregion
				#region SoldOrRentedStatus
					&& (machineDtoS.SoldOrRentedStatus == null ?
						true
						: (machineDtoS.SoldOrRentedStatus.Equals("sold") ?
							m.Sold > 0  // "sold" column > 0
							: m.Rented > 0)));  // "rented" column > 0
			#endregion

			#endregion

			#region when any machine not found (throw)
			if (machines.Count == 0)
				throw new ErrorWithCodeException(404,
					"NF-M",
					"Not Found - Machine");
			#endregion

			return await _dtoConverterService
				.MachineToMachineDtoAsync(machines);
		}


		private async Task ControlConflictErrorAsync(MachineDto machineDto)
		{
			#region get entity that have same subCategory and Model
			var entity = await _repository.MachineRepository
				.GetMachinesByConditionAsync(m => 
					m.SubCategoryName.Equals(machineDto.SubCategoryName)
					&& m.Model.Equals(machineDto.Model));
			#endregion

			#region throw error
			if (entity.Count != 0)
				throw new ErrorWithCodeException(409,
					"CE-M",
					"Conflict Error - Model");
			#endregion
		}
	}
}
