using Dapper;
using Entities.Attributes;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.MachineDtos;
using Entities.Enums;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.IIS.Core;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;

namespace Services.Concretes
{
	public partial class MachineService : IMachineService
	{
		private readonly IRepositoryManager _manager;
		private readonly IFileService _fileService;
		private readonly IConfigManager _configs;

		public MachineService(
			IRepositoryManager manager,
			IFileService fileService,
			IConfigManager configs)
		{
			_manager = manager;
			_fileService = fileService;
			_configs = configs;
		}

		public async Task CreateMachineAsync(
			MachineParamsForCreate machineParams,
			MachineDtoForCreate machineDto)
		{
			#region upload machine image to folder
			await _fileService.UploadFileToFolderAsync(
				machineParams.Language,
				machineParams.ImageFolderPathAfterWwwroot,
				machineDto.ImageName,
				machineDto.ImageContentInBase64Str,
				FileTypes.MachineImage);
			#endregion

			#region upload pdf to folder
			await _fileService.UploadFileToFolderAsync(
				machineParams.Language,
				machineParams.PdfFolderPathAfterWwwroot,
				machineDto.PdfName,
				machineDto.PdfContentInBase64Str,
				FileTypes.PDF);
			#endregion

			#region create machine (throw)

			#region set parameters
			var parameters = new DynamicParameters(new
			{
				machineDto.MainCategoryName,
				machineDto.SubCategoryName,
				machineDto.Model,
				machineDto.BrandName,
				machineDto.Stock,
				machineDto.Year,
				machineDto.HandStatus,
				#region DescriptionInTR
				DescriptionInTR = machineDto.Descriptions == null ?
					null
					: machineDto.Descriptions.TR,
				#endregion
				#region DescriptionInEN
				DescriptionInEN = machineDto.Descriptions == null ?
					null
					: machineDto.Descriptions.EN,
				#endregion
				machineDto.ImageName,
				machineDto.PdfName
			});

			parameters.Add("Language", machineParams.Language, DbType.String);
			#endregion

			#region create machine
			var errorDto = await _manager.MachineRepository
				.CreateMachineAsync(parameters);
			#endregion

			#region when any error occured (throw)
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion

			#endregion
		}

		public async Task<PagingList<MachineView>> GetAllMachinesAsync(
		  string language,
		  PaginationParameters pagingParameters,
		  HttpResponse response)
		{
			#region set parameters
			var parameters = new DynamicParameters(pagingParameters);
			
			parameters.Add("Language", language, DbType.String);
			parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
			parameters.Add("StatusCode", "", DbType.Int16, ParameterDirection.Output);
			parameters.Add("ErrorCode", "", DbType.String, ParameterDirection.Output);
			parameters.Add("ErrorDescription", "", DbType.String,
				ParameterDirection.Output);
			parameters.Add("ErrorMessage", "", DbType.String, ParameterDirection.Output);
			#endregion

			#region get machineViews
			var machineViewDict = new Dictionary<Guid, MachineView>();

			var machineViews = await _manager.MachineRepository
				.GetAllMachinesAsync(
					parameters,
					(machineViewPart, descriptionPart) =>
					{
						#region when machine id not exists in dict
						if (!machineViewDict.TryGetValue(
							machineViewPart.Id,
							out var currentMachine))
						{
							currentMachine = machineViewPart;
							machineViewDict.Add(currentMachine.Id, currentMachine);
						}
						#endregion

						#region add description to machineView
						currentMachine.Descriptions.Add(
							descriptionPart.Language,
							descriptionPart.Description);
						#endregion

						return machineViewPart;
					},
					"Language");
			#endregion

			#region when any machine not found (throw)
			var totalCount = parameters.Get<int>("TotalCount");

			if (totalCount == 0)
				throw new ErrorWithCodeException(
					parameters.Get<Int16>("StatusCode"),
					parameters.Get<string>("ErrorCode"),
					parameters.Get<string>("ErrorDescription"),
					parameters.Get<string>("ErrorMessage"));
			#endregion

			#region add pagination informations to headers

			#region create pagination list
			var machineViewPagingList = await PagingList<MachineView>
				.ToPagingListAsync(
					machineViewDict.Values,
					totalCount,
					pagingParameters.PageNumber,
					pagingParameters.PageSize);
			#endregion

			#region add informations to headers
			response.Headers.Add(
				"Machine-Pagination",
				machineViewPagingList.GetMetaDataForHeaders());
			#endregion

			#endregion

			return machineViewPagingList;
		}

		public async Task<PagingList<MachineView>> GetMachinesByConditionAsync(
			string language,
			PaginationParameters paginationParameters,
			MachineDtoForDisplay machineDto,
			HttpResponse response)
		{
			#region set parameters
			var parameters = new DynamicParameters(paginationParameters);

			parameters.Add("Language", language, DbType.String);
			parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
			parameters.Add("StatusCode", 0, DbType.Int16, ParameterDirection.Output);
			parameters.Add("ErrorCode", "", DbType.String, ParameterDirection.Output);
			parameters.Add("ErrorMessage", "", DbType.String, ParameterDirection.Output);
			parameters.Add("ErrorDescription", "", DbType.String, ParameterDirection.Output);

			parameters.AddDynamicParams(machineDto);
			#endregion

			#region get machineViews (throw)
			var machineViews = await _manager.MachineRepository
				.GetMachinesByConditionAsync(parameters);

			#region when any machine not found (throw)
			var totalCount = parameters.Get<int>("TotalCount");

			if (totalCount == 0)
				throw new ErrorWithCodeException(
					parameters.Get<Int16>("StatusCode"),
					parameters.Get<string>("ErrorCode"),
					parameters.Get<string>("ErrorDescription"),
					parameters.Get<string>("ErrorMessage"));
			#endregion

			#endregion

			#region convert machineViews to pagingList
			var machineViewPagingList = await PagingList<MachineView>.ToPagingListAsync(
				   machineViews,
				   totalCount,
				   paginationParameters.PageNumber,
				   paginationParameters.PageSize);
			#endregion

			#region add pagination infos to headers
			response.Headers.Add(
				"Machine-Pagination",
				machineViewPagingList.GetMetaDataForHeaders());
			#endregion

			return machineViewPagingList;
		}

		public async Task<IEnumerable<string>> GetMainCategoryNamesByLanguageAsync(
			string language)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add("Language", language, DbType.String);
			#endregion

			#region get mainCategoryNames
			var mainCategoryNames = await _manager.MachineRepository
				.GetMainCategoryNamesByLanguageAsync(parameters);
			#endregion

			return mainCategoryNames;
		}

		public async Task<IEnumerable<string>> GetSubCategoryNamesOfMainCategoryByLanguageAsync(
		   MachineParamsForDisplaySubCategoryNames machineParams)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add(
				"Language",
				machineParams.Language,
				DbType.String);

			parameters.Add(
				"MainCategoryName",
				machineParams.MainCategoryName,
				DbType.String);
			#endregion

			#region get SubCategoryNames
			return await _manager.MachineRepository
				.GetSubCategoryNamesOfMainCategoryByLanguageAsync(parameters);
			#endregion
		}

		public async Task<IEnumerable<string>> GetAllHandStatusByLanguageAsync(
			string language)
		{
			#region set parameters
			var parameters = new DynamicParameters();
			parameters.Add("Language", language, DbType.String);
			#endregion

			#region get handstatuses
			return await _manager.MachineRepository
				.GetAllHandStatusByLanguageAsync(parameters);
			#endregion
		}

		public async Task<IEnumerable<string>> GetAllLanguagesAsync() =>
			await _manager.MachineRepository
				.GetAllLanguagesAsync();

		public async Task UpdateMachineAsync(
		  MachineParamsForUpdate machineParams,
		  MachineDtoForUpdate machineDto)
		{
			#region update machine (throw)

			#region set paramaters
			var parameters = new DynamicParameters(new
			{
				machineDto.ImageName,
				machineDto.MainCategoryName,
				machineDto.SubCategoryName,
				machineDto.Model,
				machineDto.BrandName,
				machineDto.HandStatus,
				machineDto.PdfName,
				machineDto.Stock,
				machineDto.Rented,
				machineDto.Sold,
				machineDto.Year,
				#region DescriptionInTR
				DescriptionInTR = machineDto.Descriptions == null ?
					null
					: machineDto.Descriptions.TR,
				#endregion
				#region DescriptionInEN
				DescriptionInEN = machineDto.Descriptions == null ?
					null
					: machineDto.Descriptions.EN
				#endregion
			});

			parameters.AddDynamicParams(machineParams);
			#endregion

			#region update (throw)
			var errorDto = await _manager.MachineRepository
				.UpdateMachineAsync(parameters);

			// when any error occured (throw)
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion

			#endregion

			#region delete old and upload new image to folder
			if (machineDto.ImageName != null)
			{
				await DeleteFilesFromFolderForMachineAsync(
					machineParams.Language,
					machineDto.ImageFolderPathAfterWwwroot,
					new List<string> { machineDto.OldImageName },
					"ImageName",
					FileTypes.MachineImage);

				await _fileService.UploadFileToFolderAsync(
					machineParams.Language,
					machineDto.ImageFolderPathAfterWwwroot,
					machineDto.ImageName,
					machineDto.ImageContentInBase64Str,
					FileTypes.MachineImage);
			}
			#endregion

			#region delete old and upload new pdf to folder
			if (machineDto.PdfName != null)
			{
				await DeleteFilesFromFolderForMachineAsync(
					machineParams.Language,
					machineDto.PdfFolderPathAfterWwwroot,
					new List<string> { machineDto.OldPdfName },
					"PdfName",
					FileTypes.PDF);

				await _fileService.UploadFileToFolderAsync(
					machineParams.Language,
					machineDto.PdfFolderPathAfterWwwroot,
					machineDto.PdfName,
					machineDto.PdfContentInBase64Str,
					FileTypes.PDF);
			}
				
			#endregion
		}

		public async Task DeleteMachineAsync(
			MachineParamsForDelete machineParams,
			IEnumerable<MachineDtoForDelete> machineDtos)
		{
			#region delete machine(throw)

			#region set parameters
			var machineIds = machineDtos.Select(dto => dto.MachineId);
			var parameters = new DynamicParameters();

			parameters.Add("Language",
				machineParams.Language,
				DbType.String);

			parameters.Add("MachineIdsInString",
				string.Join(',', machineIds),
				DbType.String);

			parameters.Add("TotalMachineIdCount",
				machineIds.Count(),
				DbType.Int32);
			#endregion

			#region delete (throw)
			var errorDto = await _manager.MachineRepository
				.DeleteMachinesAsync(parameters);

			// when any error occured (throw)
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion

			#endregion

			#region delete machine image on folder
			await DeleteFilesFromFolderForMachineAsync(
				machineParams.Language,
				machineParams.ImageFolderPathAfterWwwroot,
				machineDtos.Select(m => m.ImageName),
				"ImageName",
				FileTypes.MachineImage);
			#endregion

			#region delete PDFs on folder
			await DeleteFilesFromFolderForMachineAsync(
				machineParams.Language,
				machineParams.PdfFolderPathAfterWwwroot,
				machineDtos.Select(m => m.PdfName),
				"PdfName",
				FileTypes.PDF);
			#endregion
		}
	}


	public partial class MachineService  // private functions
	{
		private async Task DeleteFilesFromFolderForMachineAsync(
			string language,
			string fileFolderPathAfterWwwroot,
			IEnumerable<string> fileNames,
			string columnNameInDb,
			FileTypes fileType)
		{
			#region set parameters
			var parameters = new DynamicParameters();
			
			parameters.Add("ColumnName",
				columnNameInDb,
				DbType.String);

			parameters.Add("ValuesInString",
				string.Join(",", fileNames),
				DbType.String);

			parameters.Add("ValuesNotExistsOnTableInString",
				"",
				DbType.String,
				ParameterDirection.Output);
			#endregion

			#region get file names that not using by other machines
			await _manager.MachineRepository
				.SeparateValuesNotExistsOnTableAsync(parameters);

			var fileNamesNotExistsOnTableInStr = parameters
				.Get<string>("ValuesNotExistsOnTableInString");

			// our purpose: dont delete files on folder when file using from other
			// machines so we get only file names that not using from other
			// machines for only delete its.
			#endregion

			#region delete files that not using by other machines (throw)
			if (fileNamesNotExistsOnTableInStr != null)
			{
				#region add image names in string to array
				var fileNamesNotExistsOnTable = fileNamesNotExistsOnTableInStr
					.Split(',');
				#endregion

				#region delete images
				foreach (var fileName in fileNamesNotExistsOnTable)
					await _fileService.DeleteFileOnFolderByPathAsync(
						language,
						fileFolderPathAfterWwwroot,
						fileName,
						fileType);
				#endregion
			}
			#endregion
		}
	}
}
