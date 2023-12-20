using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.FormDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
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

		public FormService(
			IRepositoryManager 
			manager, IConfigManager configs)
		{
			_manager = manager;
			_configs = configs;
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

		private async Task<DynamicParameters> GetParametersWithUserIdAsync(
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
			var parameters = await GetParametersWithUserIdAsync(httpContext);

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
			var parameters = await GetParametersWithUserIdAsync(httpContext);

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
			var parameters = await GetParametersWithUserIdAsync(httpContext);

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

		public async Task<FormViewForOneUser> GetAllFormsOfOneUserAsync(
			FormParamsForGetAllFormsOfOneUser formParams)
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

			#region get all forms
			var formView = await _manager.UserRepository
				.GetAllFormsOfUserAsync(
					sqlCommand,
					parameters,
					async (multiQuery) =>
					{
						#region get all forms of user from db
						var generalCommFormViews = await multiQuery
							.ReadAsync<GeneralCommunicationFormView>();

						var getOfferFormViews = await multiQuery
							.ReadAsync<GetOfferFormViewForDisplayOneUser>();

						var rentingFormViews = await multiQuery
							.ReadAsync<RentingFormFormViewForDisplayOneUser>();
						#endregion

						#region initialize formView
						return new FormViewForOneUser
						{
							GeneralCommForms = await PagingList
								<GeneralCommunicationFormView>
									.ToPagingListAsync(
										generalCommFormViews,
										generalCommFormViews.Count(),
										formParams.PageNumber,
										formParams.PageSize),

							GetOfferForms = await PagingList
								<GetOfferFormViewForDisplayOneUser>
									.ToPagingListAsync(
										getOfferFormViews,
										getOfferFormViews.Count(),
										formParams.PageNumber,
										formParams.PageSize),

							RentingForms = await PagingList
								<RentingFormFormViewForDisplayOneUser>
									.ToPagingListAsync(
										rentingFormViews,
										rentingFormViews.Count(),
										formParams.PageNumber,
										formParams.PageSize),
						};
						#endregion
					});
			#endregion

			return formView;
		}
	}
}
