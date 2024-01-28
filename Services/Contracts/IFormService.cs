using Entities.DtoModels.FormDtos;
using Entities.Enums;
using Entities.QueryParameters;
using Entities.ViewModels.FormViews;
using Microsoft.AspNetCore.Http;


namespace Services.Contracts
{
    public interface IFormService
	{
		Task CreateGenaralCommFormAsync(
            LanguageParams languageParams,
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

        Task<object> DisplayAllGeneralCommFormsAsync(
            FormParamsForDisplayAllGeneralCommForms formParams,
             HttpContext context);

        Task<object> DisplayAllGetOfferFormsAsync(
            FormParamsForDisplayAllGetOfferForms formParams,
			HttpContext context);

        Task<object> DisplayAllRentingFormsAsync(
            FormParamsForDisplayAllRentingForms formParams,
			HttpContext context);

        Task<object> DisplayGeneralCommFormsOfUserAsync(
			FormParamsForDisplayGeneralCommFormsOfUser formParams,
			HttpContext httpContext);

		Task<object> DisplayGetOfferFormsOfUserAsync(
            FormParamsForDisplayGetOfferFormsOfUser formParams,
			HttpContext httpContext);

		Task<object> DisplayRentingFormsOfUserAsync(
            FormParamsForDisplayRentingFormsOfUser formParams,
			HttpContext httpContext);

		Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
			FormParamsForAnswerTheGeneralCommForm formParams,
			HttpContext httpContext);

        Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
                FormParamsForAnswerTheGetOfferForm formParams,
                HttpContext httpContext);

        Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
            FormParamsForAnswerTheRentingForm formParams,
            HttpContext httpContext);
    }
}
