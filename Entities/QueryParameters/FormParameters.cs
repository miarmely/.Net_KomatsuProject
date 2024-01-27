using Entities.Enums;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
    public record FormParamsForDisplayAllGeneralCommForms : LanguageAndPagingParams
    {
        public bool? GetAnsweredForms { get; init; }
    }

    public record FormParamsForDisplayGeneralCommFormsOfUser
        : FormParamsForDisplayAllGeneralCommForms
    {
        public Guid? UserId { get; init; }
    }

    public record FormParamsForDisplayAllGetOfferForms
        : LanguageAndPagingParams
    {
        [Required] public FormStatuses FormStatus { get; init; }
    }

    public record FormParamsForDisplayGetOfferFormsOfUser
        : FormParamsForDisplayAllGetOfferForms
    {
       public Guid? UserId { get; init; }
    }

    public record FormParamsForDisplayAllRentingForms
        : FormParamsForDisplayAllGetOfferForms
    { }

    public record FormParamsForDisplayRentingFormsOfUser
        : FormParamsForDisplayAllGetOfferForms
    { }

    public record FormParamsForAnswerTheForm : LanguageParams
    {
        [Required] public int FormId { get; init; }
    }
}