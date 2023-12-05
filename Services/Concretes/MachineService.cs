using Dapper;
using Entities.DtoModels.MachineDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;

namespace Services.Concretes
{
    public class MachineService : IMachineService
	{
		private readonly IRepositoryManager _manager;
        private readonly IFileService _fileService;

		public MachineService(
            IRepositoryManager manager,
            IFileService fileService)
        {
			_manager = manager;
            _fileService = fileService;
		}
			
			
		public async Task CreateMachineAsync(
			MachineParamsForCreate machineParams,
			MachineDtoForCreate machineDto)
		{
			#region upload machine image to folder
			await _fileService.UploadFileToFolderAsync(
                machineParams.FolderPathAfterWwwroot,
                machineDto.ImageName,
                machineDto.ImageContentInBase64Str);
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
		        machineDto.DescriptionInTR,
		        machineDto.DescriptionInEN,
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

        public async Task<IEnumerable<string>>GetSubCategoryNamesOfMainCategoryByLanguageAsync(
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
		  MachineParamsForUpdate parameters,
		  MachineDtoForUpdate machineDto)
		{
			#region set paramaters
			var dynamicParameters = new DynamicParameters(machineDto);

			dynamicParameters.AddDynamicParams(parameters);
			#endregion

			#region update machine (throw)
			var errorDto = await _manager.MachineRepository
				.UpdateMachineAsync(dynamicParameters);

			// when any error occured (throw)
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task DeleteMachineAsync(
			string language,
			MachineDtoForDelete machineDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add(
				"MachineIdsInString",
				string.Join(',', machineDto.MachineIdList),
				DbType.String);

			parameters.Add(
				"TotalMachineIdCount",
				machineDto.MachineIdList.Count(),
				DbType.Int32);

			parameters.Add("Language", language, DbType.String);
			#endregion

			#region delete machine (throw)
			var errorDto = await _manager.MachineRepository
				.DeleteMachineAsync(parameters);

			// when any error occured (throw)
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}
	}
}
