using Entities.DtoModels;
using Entities.Exceptions;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
	public class MachineService : IMachineService
	{
		private readonly IRepositoryManager _repository;

		public MachineService(IRepositoryManager repository) =>
			_repository = repository;

		public async Task<MachineDtoForMainCategory> GetMainCategoriesAsync()
		{
			#region get mainCategories
			var mainCategories = await _repository.MainCategoryRepository
				.GetAllMainCategoriesAsync(orderBy => orderBy.Name);
			#endregion

			#region when any mainCategory not found (throw)
			if (mainCategories.Count == 0)
				new ErrorWithCodeException(404, 
					"NF-MC", 
					"Not Found - Main Category");
			#endregion
		}

	}
}
