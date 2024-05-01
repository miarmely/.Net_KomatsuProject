using Dapper;
using Entities.DtoModels;
using Entities.ViewModels.FormViews;


namespace Repositories.Contracts
{
	public interface IFormRepository : IRepositoryBase
	{
		Task<ErrorDtoWithMessage?> CreateGeneralCommFormAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage?> CreateGetOfferFormAsync(
			DynamicParameters parameters);

		Task<ErrorDtoWithMessage?> CreateRentingFormAsync(
			DynamicParameters parameters);

        Task<IEnumerable<TView>> DisplayAllGeneralCommFormsAsync<TView>(
            DynamicParameters parameters);

        Task<IEnumerable<TView>> DisplayAllGetOfferFormsAsync<TView>(
            DynamicParameters parameters);

        Task<IEnumerable<TView>> DisplayAllRentingFormsAsync<TView>(
            DynamicParameters parameters);

        Task<IEnumerable<TView>> DisplayGeneralCommFormsOfUserAsync<TView>(
			DynamicParameters parameters);

		Task<IEnumerable<TView>> DisplayGetOfferFormsOfUserAsync<TView>(
			DynamicParameters parameters);

		Task<IEnumerable<TView>> DisplayRentingFormsOfUserAsync<TView>(
			DynamicParameters parameters);

		Task<FormViewForAnswerTheForm> AnswerTheFormAsync(
			DynamicParameters parameters);
    }
}
