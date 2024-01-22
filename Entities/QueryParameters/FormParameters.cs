using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record FormParamsForGetAllFormsOfOneUser : LanguageAndPagingParams
	{
		[Required] public Guid? UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }
	}

	public record FormParamsForGetGeneralCommFormsOfOneUser : LanguageAndPagingParams
	{
		public bool? GetAnsweredForms { get; init; } 
		// true: answered forms || false: unanswered forms ||  null: all forms
	}

	public record FormParamsForGetGetOfferFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}

	public record FormParamsForGetRentingFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}
}
