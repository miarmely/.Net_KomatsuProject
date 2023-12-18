using System.ComponentModel.DataAnnotations;


namespace Entities.QueryParameters
{
	public record FormParamsForGetAllFormsOfOneUser : LanguageAndPagingParams
	{
		[Required] public Guid UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }
	}

	public record GeneralCommFormParamsForGetOneUser : PagingParams
	{
		[Required] public Guid UserId { get; init; }
		public bool? GetAnsweredForms { get; init; }
	}

	public record GetOfferFormParamsForGetOneUser : FormParamsForGetAllFormsOfOneUser
	{}

	public record RentingFormParamsForGetOneUser : FormParamsForGetAllFormsOfOneUser
	{}
}
