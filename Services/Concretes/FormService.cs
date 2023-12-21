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

		public async Task<TFormView> GetAllFormsOfOneUserAsync<TFormView>(
			FormParamsForGetAllFormsOfOneUser formParams,
			HttpContext httpContext)
		{
			#region set parameters and sql command
			var parameters = new DynamicParameters(formParams);
			var sqlCommand = $@" 
                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_GeneralCommunication_GetAllOfOneUserByUserId}
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;
                                
                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_GetOffer_GetAllOfOneUserByUserId}
                        @Language,
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;

                    EXEC {_configs.DbSettings.ProcedureNames
							.User_Form_Renting_GetAllOfOneUserByUserId}
                        @Language,
                        @UserId,
                        @PageNumber,
                        @PageSize,
                        @GetAnsweredForms;";
			#endregion

			#region when "answered" forms is wanted
			TFormView formView;
			if (formParams.GetAnsweredForms == true)
			{
				formView = await _manager.UserRepository
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
							GeneralCommForms = answeredGCFormPagingList,
							GetOfferForms = answeredGOFormPagingList,
							RentingForms = answeredRFormPagingList
						};
					});
			}
			#endregion


							#region when "unanswered" forms is wanted
							case false:
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
				GeneralCommForms = unansweredGCFormPagingList,
				GetOfferForms = unansweredGOFormPagingList,
				RentingForms = unansweredRFormPagingList
			};

							#region when "answered" and "unanswered" forms is wanted
							case null:
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
					"Form-Unanswered-GeneralCommunication",
					httpContext);

			var allGOFormPagingList = await PagingList
				<AllGetOfferFormViewForOneUser>
				.ToPagingListAsync(
					allGOFormViews,
					allGOFormViews.Count(),
					formParams.PageNumber,
					formParams.PageSize,
					"Form-Unanswered-GetOffer",
					httpContext);

			var allRFormPagingList = await PagingList
				<AllRentingFormViewForOneUser>
				.ToPagingListAsync(
					allRFormViews,
					allRFormViews.Count(),
					formParams.PageNumber,
					formParams.PageSize,
					"Form-Unanswered-Renting",
					httpContext);
			#endregion

			return new AllFormViewForOneUser()
			{
				GeneralCommForms = allGCFormPagingList,
				GetOfferForms = allGOFormPagingList,
				RentingForms = allRFormPagingList
			};
			#endregion
		}
	});
			}

var formView = await _manager.UserRepository
	.GetAllFormsOfUserAsync<TFormView>(
		sqlCommand,
		parameters,
		async (multiQuery) =>
		{
			switch (formParams.GetAnsweredForms)
			{
				#region when "answered" forms is wanted
				case true:
					#region get answered all forms of user
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
						GeneralCommForms = answeredGCFormPagingList,
						GetOfferForms = answeredGOFormPagingList,
						RentingForms = answeredRFormPagingList
					};

				#endregion

				#region when "unanswered" forms is wanted
				case false:
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
						GeneralCommForms = unansweredGCFormPagingList,
						GetOfferForms = unansweredGOFormPagingList,
						RentingForms = unansweredRFormPagingList
					};

				#region when "answered" and "unanswered" forms is wanted
				case null:
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
							"Form-Unanswered-GeneralCommunication",
							httpContext);

					var allGOFormPagingList = await PagingList
						<AllGetOfferFormViewForOneUser>
						.ToPagingListAsync(
							allGOFormViews,
							allGOFormViews.Count(),
							formParams.PageNumber,
							formParams.PageSize,
							"Form-Unanswered-GetOffer",
							httpContext);

					var allRFormPagingList = await PagingList
						<AllRentingFormViewForOneUser>
						.ToPagingListAsync(
							allRFormViews,
							allRFormViews.Count(),
							formParams.PageNumber,
							formParams.PageSize,
							"Form-Unanswered-Renting",
							httpContext);
					#endregion

					return new AllFormViewForOneUser()
					{
						GeneralCommForms = allGCFormPagingList,
						GetOfferForms = allGOFormPagingList,
						RentingForms = allRFormPagingList
					};
					#endregion
			}
		});
#endregion

return formView;
		}
	}
}
