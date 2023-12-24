using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record FormParamsForGetAllFormsOfOneUser : LanguageAndPagingParams
	{
		[Required] public Guid? UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }
	}

	public record FormParamsForGetGeneralCommFormsOfOneUser : PagingParams
	{
		[Required] public Guid? UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }
	}

	public record FormParamsForGetGetOfferFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}

	public record FormParamsForGetRentingFormsOfOneUser : FormParamsForGetAllFormsOfOneUser
	{}
}
