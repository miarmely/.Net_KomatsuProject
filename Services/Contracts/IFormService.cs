using Entities.DtoModels.FormDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;
using Repositories;

namespace Services.Contracts
{
    public interface IFormService
	{
		Task CreateGenaralCommFormAsync(
			GeneralCommFormDtoForCreate formDto,
			HttpContext httpContext);

		Task CreateGetOfferFormAsync(
			LanguageParams languageParams,
			GetOfferFormDtoForCreate formDto,
			HttpContext httpContext);

		Task CreateRentingFormAsync(
			LanguageParams languageParams,
			RentingFormDtoForCreate formDto,
			HttpContext httpContext);

		Task<object> GetAllFormTypesOfOneUserAsync(
			FormParamsForGetAllFormsOfOneUser formParams,
			HttpContext httpContext);

		Task<object> GetGeneralCommFormsOfOneUserAsync(
			FormParamsForGetGeneralCommFormsOfOneUser formParams,
			HttpContext httpContext);

		Task<object> GetGetOfferFormsOfOneUserAsync(
			FormParamsForGetGetOfferFormsOfOneUser formParams,
			HttpContext httpContext);

		Task<object> GetRentingFormsOfOneUserAsync(
			FormParamsForGetRentingFormsOfOneUser formParams,
			HttpContext httpContext);
	}
}
