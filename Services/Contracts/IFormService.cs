using Entities.DtoModels.FormDtos;
using Entities.QueryParameters;
using Entities.ViewModels.FormViews;
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

		Task<FormViewForOneUser> GetAllFormsOfOneUserAsync(
			FormParamsForGetAllFormsOfOneUser formParams,
			HttpContext httpContext);
	}
}
