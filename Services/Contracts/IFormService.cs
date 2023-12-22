using Entities.DtoModels.FormDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Http;


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
			FormParamsForGetGeneralCommFormsOfOneUser formParams);

		Task<object> GetGetOfferFormsOfOneUserAsync(
			FormParamsForGetGetOfferFormsOfOneUser formParams);

		Task<object> GetRentingFormsOfOneUserAsync(
			FormParamsForGetRentingFormsOfOneUser formParams);
	}
}
