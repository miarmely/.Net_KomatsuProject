namespace Entities.QueryParameters
{
	public record FormParamsForGetAllFormsOfOneUser(
		string Language,
		Guid UserId,
		int PageNumber,
		int PageSize,
		bool? GetAnsweredForms
	);

	public record GeneralCommFormParamsForGetOneUser(
		Guid UserId,
		int PageNumber,
		int PageSize,
		bool GetAnsweredForms
	);

	public record GetOfferFormParamsForGetOneUser(
		string Language,
		Guid UserId,
		int PageNumber,
		int PageSize,
		bool GetAnsweredForms
	);

	public record RentingFormParamsForGetOneUser(
		string Language,
		Guid UserId,
		int PageNumber,
		int PageSize,
		bool GetAnsweredForms
	);
}
