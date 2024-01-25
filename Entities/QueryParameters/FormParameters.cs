using Entities.QueryParameters;
using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record FormParamsForGetAllFormsOfOneUser : LanguageAndPagingParams
	{
		[Required] public Guid? UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }  
        // true: answered forms || false: unanswered forms ||  null: all forms
    }

	public record FormParamsForGetGeneralCommFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
    {}

    public record FormParamsForGetGetOfferFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}
    
    public record FormParamsForGetRentingFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}

    public record FormParamsForGetAllGeneralCommForms : LanguageAndPagingParams
    {
        public bool? GetAnsweredForms { get; init; }
    }

    public record FormParamsForGetAllGetOfferForms : FormParamsForGetAllGeneralCommForms
    { }

    public record FormParamsForGetAllRentingForms : FormParamsForGetAllGeneralCommForms
    { }

    public record FormParamsForAnswer : LanguageParams
    {
        [Required] public int FormId { get; init; }
    }
}


