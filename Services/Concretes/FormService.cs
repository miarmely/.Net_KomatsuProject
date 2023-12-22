using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.FormDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Entities.ViewModels.FormViews;
using Microsoft.AspNetCore.Http;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;


namespace Services.Concretes
{
	public partial class FormService : IFormService
	{

		private readonly IRepositoryManager _manager;
		private readonly IConfigManager _configs;

		public FormService(IRepositoryManager manager)
		{
			_manager = manager;
			_configs = _manager.FormRepository.Configs;
		}

		private async Task<JwtSecurityToken> GetTokenFromHttpContextAsync(
			HttpContext httpContext)
		{
			#region get token in str from http context
			var jwtTokenInStr = httpContext.Request.Headers.Authorization
				.ToString()
				.Replace("Bearer ", "");  // remove Bearer tag
			#endregion

			return new JwtSecurityToken(jwtTokenInStr);
		}

		private async Task<DynamicParameters> GetDynamicParametersWithUserIdAsync(
			HttpContext httpContext)
		{
			#region get user id from token
			var jwtToken = await GetTokenFromHttpContextAsync(httpContext);

			var userIdInStr = jwtToken.Claims
				.FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier))
				.Value;
			#endregion

			#region set parameters
			var parameters = new DynamicParameters();

			parameters.Add(
				"UserId",
				new Guid(userIdInStr),
				DbType.Guid);
			#endregion

			return parameters;
		}
	}

	public partial class FormService // main services
	{
		public async Task CreateGenaralCommFormAsync(
			GeneralCommFormDtoForCreate formDto,
			HttpContext httpContext)
		{
			#region set parameters
			var parameters = await GetDynamicParametersWithUserIdAsync(httpContext);

			parameters.AddDynamicParams(formDto);
			#endregion

			await _manager.UserRepository
				.CreateGeneralCommFormAsync(parameters);
		}

		public async Task CreateGetOfferFormAsync(
			LanguageParams languageParams,
			GetOfferFormDtoForCreate formDto,
			HttpContext httpContext)
		{
			#region set parameters
			var parameters = await GetDynamicParametersWithUserIdAsync(httpContext);

			parameters.AddDynamicParams(formDto);
			parameters.Add("Language", languageParams.Language, DbType.String);
			#endregion

			#region create form (throw)
			var errorDto = await _manager.UserRepository
				.CreateGetOfferFormAsync(parameters);

			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task CreateRentingFormAsync(
			LanguageParams languageParams,
			RentingFormDtoForCreate formDto,
			HttpContext httpContext)
		{
			#region set parameters
			var parameters = await GetDynamicParametersWithUserIdAsync(httpContext);

			parameters.AddDynamicParams(formDto);
			parameters.Add("Language", languageParams.Language, DbType.String);
			#endregion

			#region create form (throw)
			var errorDto = await _manager.UserRepository
				.CreateRentingFormAsync(parameters);

			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task<object> GetAllFormTypesOfOneUserAsync(
			FormParamsForGetAllFormsOfOneUser formParams,
			HttpContext httpContext)
		{
			#region set parameters and sql command
			var parameters = new DynamicParameters(formParams);
			var sqlCommand = $@" 
					-- get `general communication` forms
                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_GeneralCommunication_GetAllOfOneUserByUserId}
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;
                    
					-- get `get offer` forms
                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_GetOffer_GetAllOfOneUserByUserId}
                        @Language,
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;

					-- get `renting`forms
                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_Renting_GetAllOfOneUserByUserId}
                        @Language,
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;";
			#endregion

			#region when "answered" forms is wanted
			if (formParams.GetAnsweredForms == true)
				#region get "answered" forms
				return await _manager
					.UserRepository
					.GetAllFormsOfUserAsync(
						sqlCommand,
						parameters,
						async (multiQuery) =>
						{
							#region get "answered" all forms of one user
							var answeredGCFormViews = await multiQuery
								.ReadAsync<AnsweredGeneralCommFormViewForOneUser>();

							var answeredGOFormViews = await multiQuery
								.ReadAsync<AnsweredGetOfferFormViewForOneUser>();

							var answeredRFormViews = await multiQuery
								.ReadAsync<AnsweredRentingFormViewForOneUser>();
							#endregion

							#region save paging infos of forms to header
							var answeredGCFormPagingList = await PagingList
								<AnsweredGeneralCommFormViewForOneUser>
								.ToPagingListAsync(
									answeredGCFormViews,
									answeredGCFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Answered-GeneralCommunication",
									httpContext);

							var answeredGOFormPagingList = await PagingList
								<AnsweredGetOfferFormViewForOneUser>
								.ToPagingListAsync(
									answeredGOFormViews,
									answeredGOFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Answered-GetOffer",
									httpContext);

							var answeredRFormPagingList = await PagingList
								<AnsweredRentingFormViewForOneUser>
								.ToPagingListAsync(
									answeredRFormViews,
									answeredRFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Answered-Renting",
									httpContext);
							#endregion

							return new AnsweredFormViewForOneUser()
							{
								GeneralCommunicationForms =
									answeredGCFormPagingList,
								GetOfferForms = answeredGOFormPagingList,
								RentingForms = answeredRFormPagingList

							};
						});
			#endregion
			#endregion

			#region when "unanswered" forms is wanted
			else if (formParams.GetAnsweredForms == false)
				#region get "unanswered" forms
				return await _manager
					.UserRepository
					.GetAllFormsOfUserAsync(
						sqlCommand,
						parameters,
						async (multiQuery) =>
						{
							#region get "unanswered" all forms of user
							var unansweredGCFormViews = await multiQuery
								.ReadAsync<UnansweredGeneralCommFormViewForOneUser>();

							var unansweredGOFormViews = await multiQuery
								.ReadAsync<UnansweredGetOfferFormViewForOneUser>();

							var unansweredRFormViews = await multiQuery
								.ReadAsync<UnansweredRentingFormViewForOneUser>();
							#endregion

							#region save paging infos of forms to header
							var unansweredGCFormPagingList = await PagingList
								<UnansweredGeneralCommFormViewForOneUser>
								.ToPagingListAsync(
									unansweredGCFormViews,
									unansweredGCFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Unanswered-GeneralCommunication",
									httpContext);

							var unansweredGOFormPagingList = await PagingList
								<UnansweredGetOfferFormViewForOneUser>
								.ToPagingListAsync(
									unansweredGOFormViews,
									unansweredGOFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Unanswered-GetOffer",
									httpContext);

							var unansweredRFormPagingList = await PagingList
								<UnansweredRentingFormViewForOneUser>
								.ToPagingListAsync(
									unansweredRFormViews,
									unansweredRFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-Unanswered-Renting",
									httpContext);
							#endregion

							return new UnansweredFormViewForOneUser()
							{
								GeneralCommunicationForms =
									unansweredGCFormPagingList,
								GetOfferForms = unansweredGOFormPagingList,
								RentingForms = unansweredRFormPagingList
							};
						});
			#endregion
			#endregion

			#region when "answered" and "unanswered" forms is wanted
			else
				#region get "answered" and "unanswered" forms
				return await _manager
					.UserRepository
					.GetAllFormsOfUserAsync(
						sqlCommand,
						parameters,
						async (multiQuery) =>
						{
							#region get "answered" and "unanswered" all forms of user
							var allGCFormViews = await multiQuery
								.ReadAsync<AllGeneralCommFormViewForOneUser>();

							var allGOFormViews = await multiQuery
								.ReadAsync<AllGetOfferFormViewForOneUser>();

							var allRFormViews = await multiQuery
								.ReadAsync<AllRentingFormViewForOneUser>();
							#endregion

							#region save paging infos of forms to header
							var allGCFormPagingList = await PagingList
								<AllGeneralCommFormViewForOneUser>
								.ToPagingListAsync(
									allGCFormViews,
									allGCFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-All-GeneralCommunication",
									httpContext);

							var allGOFormPagingList = await PagingList
								<AllGetOfferFormViewForOneUser>
								.ToPagingListAsync(
									allGOFormViews,
									allGOFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-All-GetOffer",
									httpContext);

							var allRFormPagingList = await PagingList
								<AllRentingFormViewForOneUser>
								.ToPagingListAsync(
									allRFormViews,
									allRFormViews.Count(),
									formParams.PageNumber,
									formParams.PageSize,
									"Form-All-Renting",
									httpContext);
							#endregion

							return new AllFormViewForOneUser()
							{
								GeneralCommunicationForms = allGCFormPagingList,
								GetOfferForms = allGOFormPagingList,
								RentingForms = allRFormPagingList
							};
						});
			#endregion
			#endregion
		}

		public async Task<object> GetGeneralCommFormsOfOneUserAsync(
			FormParamsForGetGeneralCommFormsOfOneUser formParams)
		{
			#region get general communication forms of one user
			var parameters = new DynamicParameters(formParams);

			object formView = formParams.GetAnsweredForms switch
			{
				#region when "answered" forms is wanting
				true => await _manager.FormRepository
					.GetGeneralCommFormsOfOneUserAsync
					<AnsweredGeneralCommFormViewForOneUser>(parameters),
				#endregion

				#region when "unanswered" forms is wanting
				false => await _manager.FormRepository
					.GetGeneralCommFormsOfOneUserAsync
					<UnansweredGeneralCommFormViewForOneUser>(parameters),
				#endregion

				#region when "answered" and "unanswered" forms is wanting
				null => await _manager.FormRepository
					.GetGeneralCommFormsOfOneUserAsync
					<AllGeneralCommFormViewForOneUser>(parameters)
				#endregion
			};
			#endregion

			return formView;
		}

		public async Task<object> GetGetOfferFormsOfOneUserAsync(
			FormParamsForGetGetOfferFormsOfOneUser formParams)
		{
			#region get "get offer" forms of one user
			var parameters = new DynamicParameters(formParams);

			object formView = formParams.GetAnsweredForms switch
			{
				#region when "answered" forms is wanting
				true => await _manager.FormRepository
					.GetGetOfferFormsOfOneUserAsync
					<AnsweredGetOfferFormViewForOneUser>(parameters),
				#endregion

				#region when "unanswered" forms is wanting
				false => await _manager.FormRepository
					.GetGetOfferFormsOfOneUserAsync
					<UnansweredGetOfferFormViewForOneUser>(parameters),
				#endregion

				#region when "answered" and "unanswered" forms is wanting
				null => await _manager.FormRepository
					.GetGetOfferFormsOfOneUserAsync
					<AllGetOfferFormViewForOneUser>(parameters)
				#endregion
			};
			#endregion

			return formView;
		}

		public async Task<object> GetRentingFormsOfOneUserAsync(
			FormParamsForGetRentingFormsOfOneUser formParams)
		{
			#region get renting forms of one user
			var parameters = new DynamicParameters(formParams);

			object formView = formParams.GetAnsweredForms switch
			{
				#region when "answered" forms is wanting
				true => await _manager.FormRepository
					.GetRentingFormsOfOneUserAsync
					<AnsweredRentingFormViewForOneUser>(parameters),
				#endregion

				#region when "unanswered" forms is wanting
				false => await _manager.FormRepository
					.GetRentingFormsOfOneUserAsync
					<UnansweredRentingFormViewForOneUser>(parameters),
				#endregion

				#region when "answered" and "unanswered" forms is wanting
				null => await _manager.FormRepository
					.GetRentingFormsOfOneUserAsync
					<AllRentingFormViewForOneUser>(parameters)
				#endregion
			};
			#endregion

			return formView;
		}
	}
}
