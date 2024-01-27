using Dapper;
using Entities.DtoModels;
using Entities.ViewModels.FormViews;


namespace Repositories.Contracts
{
	public interface IFormRepository : IRepositoryBase
	{
		Task CreateGeneralCommFormAsync(
			DynamicParameters parameters);

		Task<ErrorDto?> CreateGetOfferFormAsync(
			DynamicParameters parameters);

		Task<ErrorDto?> CreateRentingFormAsync(
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
