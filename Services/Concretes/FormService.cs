using Dapper;
using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels;
using Entities.DtoModels.FormDtos;
using Entities.Enums;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Entities.ViewModels.FormViews;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.IIS.Core;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;
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

        private async Task<Guid> GetUserIdFromClaimsAsync(HttpContext httpContext)
        {
            #region get user id from claims
            var userId = Guid.Parse(httpContext.User.Claims
                .FirstOrDefault(c => c.Type.Equals(ClaimTypes.NameIdentifier))
                .Value);
            #endregion

            return userId;
        }

        private async Task<PagingList<TFormView>> GetFormsOfUserAsPagingListAsync<TFormView>(
            string language,
            int pageNumber,
            int pageSize,
            string headerKey,
            HttpContext httpContext,
            FormTypes? formType = null,
            DynamicParameters? parameters = null,
            IEnumerable<TFormView>? formViews = null)
            where TFormView : class
        {
            #region get form by form type if not send as parameter
            if (formViews == null)
                formViews = formType switch
                {
                    FormTypes.GeneralCommunication => await _manager
                        .FormRepository
                        .DisplayGeneralCommFormsOfUserAsync<TFormView>(parameters),

                    FormTypes.GetOffer => await _manager
                        .FormRepository
                        .DisplayGetOfferFormsOfUserAsync<TFormView>(parameters),

                    FormTypes.Renting => await _manager
                        .FormRepository
                        .DisplayRentingFormsOfUserAsync<TFormView>(parameters)
                };
            #endregion

            #region when any form not found (throw)
            if (formViews.Count() == 0)
                throw new ExceptionWithMessage(
                    ErrorDetailsConfig.ToErrorDto(
                        language,
                        _configs.ErrorDetails.NF_Fo));
            #endregion

            #region get formViews as paging list
            var pagingList = await PagingList<TFormView>
                .ToPagingListAsync(
                    formViews,
                    parameters.Get<int>("TotalCount"),
                    pageNumber,
                    pageSize,
                    headerKey,
                    httpContext);
            #endregion

            return pagingList;
        }

        private async Task<PagingList<TFormView>> GetAllFormsAsPagingListAsync<TFormView>(
            string language,
            int pageNumber,
            int pageSize,
            string headerKey,
            HttpContext httpContext,
            FormTypes? formType = null,
            DynamicParameters? parameters = null,
            IEnumerable<TFormView>? formViews = null)
            where TFormView : class
        {
            #region get form by form type if not send as parameter
            if (formViews == null)
                formViews = formType switch
                {
                    FormTypes.GeneralCommunication => await _manager
                        .FormRepository
                        .DisplayAllGeneralCommFormsAsync<TFormView>(parameters),

                    FormTypes.GetOffer => await _manager
                        .FormRepository
                        .DisplayAllGetOfferFormsAsync<TFormView>(parameters),

                    FormTypes.Renting => await _manager
                        .FormRepository
                        .DisplayAllRentingFormsAsync<TFormView>(parameters)
                };
            #endregion

            #region when any form not found (throw)
            if (formViews.Count() == 0)
                throw new ExceptionWithMessage(
                    ErrorDetailsConfig.ToErrorDto(
                        language,
                        _configs.ErrorDetails.NF_Fo));
            #endregion

            #region get form views as paging list
            var pagingList = await PagingList<TFormView>
                .ToPagingListAsync(
                    formViews,
                    parameters.Get<int>("TotalCount"),
                    pageNumber,
                    pageSize,
                    headerKey,
                    httpContext);
            #endregion

            return pagingList;
        }

        private async Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
            DynamicParameters parameters)
        {
            #region add error params
            parameters.Add("StatusCode",
                0,
                DbType.Int16,
                ParameterDirection.Output);

            parameters.Add("ErrorCode",
                "",
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorDescription",
                "",
                DbType.String,
                ParameterDirection.Output);

            parameters.Add("ErrorMessage",
                "",
                DbType.String,
                ParameterDirection.Output);
            #endregion

            #region answer the form (error)
            var answererInfos = await _manager.FormRepository
                .AnswerTheFormAsync(parameters);

            // when any error occured
            if (answererInfos == null)
                throw new ExceptionWithMessage(
                    parameters.Get<Int16>("StatusCode"),
                    parameters.Get<string>("ErrorCode"),
                    parameters.Get<string>("ErrorDescription"),
                    parameters.Get<string>("ErrorMessage"));
            #endregion

            return answererInfos;
        }
    }

    public partial class FormService // services
    {
        #region create
        public async Task CreateGenaralCommFormAsync(
            LanguageParams languageParams,
            GeneralCommFormDtoForCreate formDto,
            HttpContext httpContext)
        {
            #region set parameters
            var parameters = new DynamicParameters(formDto);

            parameters.AddDynamicParams(new
            {
                languageParams.Language,
                UserId = await GetUserIdFromClaimsAsync(httpContext)
            });

            #endregion

            #region create form (throw)
            var errorDto = await _manager.FormRepository
                .CreateGeneralCommFormAsync(parameters);

            // when conflict error occured
            if (errorDto != null)
                throw new ExceptionWithMessage(errorDto);
            #endregion
        }

        public async Task CreateGetOfferFormAsync(
            LanguageParams languageParams,
            GetOfferFormDtoForCreate formDto,
            HttpContext httpContext)
        {
            #region set parameters
            var parameters = new DynamicParameters(formDto);

            parameters.AddDynamicParams(new
            {
                languageParams.Language,
                UserId = await GetUserIdFromClaimsAsync(httpContext)
            });
            #endregion

            #region create form (throw)
            var errorDto = await _manager.FormRepository
                .CreateGetOfferFormAsync(parameters);

            if (errorDto != null)
                throw new ExceptionWithMessage(errorDto);
            #endregion
        }

        public async Task CreateRentingFormAsync(
            LanguageParams languageParams,
            RentingFormDtoForCreate formDto,
            HttpContext httpContext)
        {
            #region set parameters
            var parameters = new DynamicParameters(formDto);

            parameters.AddDynamicParams(new
            {
                languageParams.Language,
                UserId = await GetUserIdFromClaimsAsync(httpContext)
            });
            #endregion

            #region create form (throw)
            var errorDto = await _manager.FormRepository
                .CreateRentingFormAsync(parameters);

            if (errorDto != null)
                throw new ExceptionWithMessage(errorDto);
            #endregion
        }
        #endregion

        #region display
        public async Task<object> DisplayAllGeneralCommFormsAsync(
           FormParamsForDisplayAllGeneralCommForms formParams,
           HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.PageNumber,
                formParams.PageSize,
                formParams.GetAnsweredForms
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get forms by form status
            object formsInPagingList = formParams.GetAnsweredForms switch
            {
                true => await GetAllFormsAsPagingListAsync
                    <FormViewForAllAnsweredGeneralCommForms>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-Answered",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters),

                false => await GetAllFormsAsPagingListAsync
                    <FormViewForAllUnansweredGeneralCommForms>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-Unanswered",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters),

                null => await GetAllFormsAsPagingListAsync
                    <FormViewForAllGeneralCommForms>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-All",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters)
            };
            #endregion

            return formsInPagingList;
        }

        public async Task<object> DisplayAllGetOfferFormsAsync(
             FormParamsForDisplayAllGetOfferForms formParams,
             HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                formParams.PageNumber,
                formParams.PageSize,
                FormStatusId = formParams.FormStatus
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get forms by form status 
            object formsInPagingList = formParams.FormStatus switch
            {
                FormStatuses.Waiting => await GetAllFormsAsPagingListAsync
                    <FormViewForWaitingGetOfferFormsOfAllUsers>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Go-Waiting",
                    context,
                    FormTypes.GetOffer,
                    parameters),

                FormStatuses.Accepted => await GetAllFormsAsPagingListAsync
                    <FormViewForAcceptedGetOfferFormsOfAllUsers>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Go-Accepted",
                    context,
                    FormTypes.GetOffer,
                    parameters),

                FormStatuses.Rejected => await GetAllFormsAsPagingListAsync
                    <FormViewForRejectedGetOfferFormsOfAllUsers>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Go-Rejected",
                    context,
                    FormTypes.GetOffer,
                    parameters)
            };
            #endregion

            return formsInPagingList;
        }

        public async Task<object> DisplayAllRentingFormsAsync(
            FormParamsForDisplayAllRentingForms formParams,
            HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                formParams.PageNumber,
                formParams.PageSize,
                FormStatusId = formParams.FormStatus
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get forms by form status 
            object formsInPagingList = formParams.FormStatus switch
            {
                FormStatuses.Waiting => await GetAllFormsAsPagingListAsync
                    <FormViewForWaitingRentingFormsOfAllUsers>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Waiting",
                        context,
                        FormTypes.Renting,
                        parameters),

                FormStatuses.Accepted => await GetAllFormsAsPagingListAsync
                    <FormViewForAcceptedRentingFormsOfAllUsers>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Accepted",
                        context,
                        FormTypes.Renting,
                        parameters),

                FormStatuses.Rejected => await GetAllFormsAsPagingListAsync
                    <FormViewForRejectedRentingFormsOfAllUsers>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Rejected",
                        context,
                        FormTypes.Renting,
                        parameters)
            };
            #endregion

            return formsInPagingList;
        }

        public async Task<object> DisplayGeneralCommFormsOfUserAsync(
            FormParamsForDisplayGeneralCommFormsOfUser formParams,
            HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.PageNumber,
                formParams.PageSize,
                formParams.GetAnsweredForms,
                UserId = formParams.UserId ?? await GetUserIdFromClaimsAsync(context)
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get forms by form status 
            object formsInPagingList = formParams.GetAnsweredForms switch
            {
                true => await GetFormsOfUserAsPagingListAsync
                    <FormViewForAnsweredGeneralCommFormsOfUser>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-Answered",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters),

                false => await GetFormsOfUserAsPagingListAsync
                    <FormViewForUnansweredGeneralCommFormsOfUser>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-Unanswered",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters),

                null => await GetFormsOfUserAsPagingListAsync
                    <FormViewForGeneralCommFormsOfUser>(
                    formParams.Language,
                    formParams.PageNumber,
                    formParams.PageSize,
                    "Form-Gc-All",
                    context,
                    FormTypes.GeneralCommunication,
                    parameters)
            };
            #endregion

            return formsInPagingList;
        }

        public async Task<object> DisplayGetOfferFormsOfUserAsync(
            FormParamsForDisplayGetOfferFormsOfUser formParams,
            HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                UserId = formParams.UserId ?? await GetUserIdFromClaimsAsync(context),
                formParams.PageNumber,
                formParams.PageSize,
                FormStatusId = formParams.FormStatus,
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get "get offer" forms of user as paging List
            object formsInPagingList = formParams.FormStatus switch
            {
                FormStatuses.Waiting => await GetFormsOfUserAsPagingListAsync
                    <FormViewForWaitingGetOfferFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-Go-Waiting",
                        context,
                        FormTypes.GetOffer,
                        parameters),

                FormStatuses.Accepted => await GetFormsOfUserAsPagingListAsync
                    <FormViewForAcceptedGetOfferFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-Go-Accepted",
                        context,
                        FormTypes.GetOffer,
                        parameters),

                FormStatuses.Rejected => await GetFormsOfUserAsPagingListAsync
                    <FormViewForRejectedGetOfferFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-Go-Rejected",
                        context,
                        FormTypes.GetOffer,
                        parameters)
            };
            #endregion

            return formsInPagingList;
        }

        public async Task<object> DisplayRentingFormsOfUserAsync(
            FormParamsForDisplayRentingFormsOfUser formParams,
            HttpContext context)
        {
            #region set parameters
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                UserId = formParams.UserId ?? await GetUserIdFromClaimsAsync(context),
                formParams.PageNumber,
                formParams.PageSize,
                FormStatusId = formParams.FormStatus,
            });

            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get "renting" forms of user as paging List
            object formsInPagingList = formParams.FormStatus switch
            {
                FormStatuses.Waiting => await GetFormsOfUserAsPagingListAsync
                    <FormViewForWaitingRentingFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Waiting",
                        context,
                        FormTypes.Renting,
                        parameters),

                FormStatuses.Accepted => await GetFormsOfUserAsPagingListAsync
                    <FormViewForAcceptedRentingFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Accepted",
                        context,
                        FormTypes.Renting,
                        parameters),

                FormStatuses.Rejected => await GetFormsOfUserAsPagingListAsync
                    <FormViewForRejectedRentingFormOfUser>(
                        formParams.Language,
                        formParams.PageNumber,
                        formParams.PageSize,
                        "Form-R-Rejected",
                        context,
                        FormTypes.Renting,
                        parameters)
            };
            #endregion

            return formsInPagingList;
        }
        #endregion

        #region answer
        public async Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
            FormParamsForAnswerTheGeneralCommForm formParams,
            HttpContext httpContext)
        {
            #region answer the form
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                FormType = "GeneralCommunication",
                formParams.FormId,
                AnswererId = await GetUserIdFromClaimsAsync(httpContext),
                AnsweredDate = DateTime.UtcNow,
            });

            var answererInfos = await AnswerTheFormAsync(parameters);
            #endregion

            return answererInfos;
        }

        public async Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
            FormParamsForAnswerTheGetOfferForm formParams,
            HttpContext httpContext)
        {
            #region answer the form
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                FormType = "GetOffer",
                formParams.FormId,
                FormStatusId = formParams.FormStatus,
                AnswererId = await GetUserIdFromClaimsAsync(httpContext),
                AnsweredDate = DateTime.UtcNow,
            });

            var answererInfos = await AnswerTheFormAsync(parameters);
            #endregion

            return answererInfos;
        }

        public async Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
            FormParamsForAnswerTheRentingForm formParams,
            HttpContext httpContext)
        {
            #region answer the form
            var parameters = new DynamicParameters(new
            {
                formParams.Language,
                FormType = "Renting",
                formParams.FormId,
                FormStatusId = formParams.FormStatus,
                AnswererId = await GetUserIdFromClaimsAsync(httpContext),
                AnsweredDate = DateTime.UtcNow,
            });

            var answererInfos = await AnswerTheFormAsync(parameters);
            #endregion

            return answererInfos;
        }
        #endregion
    }
}