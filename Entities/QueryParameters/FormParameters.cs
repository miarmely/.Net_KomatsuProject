using Entities.Enums;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
    public record FormParamsForDisplayAllGeneralCommForms : LanguageAndPagingParams
    {
        public bool? GetAnsweredForms { get; init; }
    }

    public record FormParamsForDisplayAllGetOfferForms
        : LanguageAndPagingParams
    {
        [Required] public FormStatuses FormStatus { get; init; }
    }

    public record FormParamsForDisplayAllRentingForms
        : FormParamsForDisplayAllGetOfferForms
    { }

    public record FormParamsForDisplayGeneralCommFormsOfUser
        : FormParamsForDisplayAllGeneralCommForms
    {
        public Guid? UserId { get; init; }
    }

    public record FormParamsForDisplayGetOfferFormsOfUser
        : FormParamsForDisplayAllGetOfferForms
    {
       public Guid? UserId { get; init; }
    }

    public record FormParamsForDisplayRentingFormsOfUser
        : FormParamsForDisplayAllRentingForms
    {
        public Guid? UserId { get; init; }
    }

    public record FormParamsForAnswerTheGeneralCommForm : LanguageParams
    {
        [Required] public int FormId { get; init; }
    }

    public record FormParamsForAnswerTheGetOfferForm 
        : FormParamsForAnswerTheGeneralCommForm
    {
        [Required] public FormStatuses FormStatus { get; init; }
    }

    public record FormParamsForAnswerTheRentingForm 
        : FormParamsForAnswerTheGetOfferForm
    {}
}