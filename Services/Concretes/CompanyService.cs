using Entities.DataModels;
using Entities.Exceptions;
using Repositories.Contracts;
using Services.Contracts;


namespace Services.Concretes
{
	public class CompanyService : ICompanyService
	{
		private readonly IRepositoryManager _manager;

        public CompanyService(IRepositoryManager manager) =>
			_manager = manager;

        public async Task CreateCompanyAsync(Company company)
		{
			#region get company by name
			var entity = await _manager.CompanyRepository
				.GetCompanyByNameAsync(company.Name, false);
			#endregion

			#region when companyName already exists
			if (entity != null)
				throw new ErrorWithCodeException(409, 
					"CE-C",
					"Conflict Error - CompanyName");
			#endregion
		}

		public async Task<List<Company>> GetAllCompaniesAsync(bool trackChanges)
		{
			#region get companies
			var entity = await _manager.CompanyRepository
				.GetAllCompaniesAsync(trackChanges);
			#endregion

			#region when any companies not found
			if (entity.Count == 0)
				throw new ErrorWithCodeException(404,
					"C-NF",
					"Company - Not Found");
			#endregion

			return entity;
		}

		public async Task<Company?> GetCompanyByIdAsync(int id, bool trackChanges)
		{
			#region get company by id
			var entity = await _manager.CompanyRepository
				.GetCompanyByIdAsync(id, trackChanges);
			#endregion

			#region when company not found
			_ = entity ?? throw new ErrorWithCodeException(404,
					"C-NF",
					"Company - Not Found");
			#endregion

			return entity;
		}

		public async Task<Company?> GetCompanyByNameAsync(string name, bool trackChanges)
		{
			#region get company by name
			var entity = await _manager.CompanyRepository
				.GetCompanyByNameAsync(name, trackChanges);
			#endregion

			#region when company not found
			_ = entity ?? throw new ErrorWithCodeException(404,
					"C-NF",
					"Company - Not Found");
			#endregion

			return entity;
		}
	}
}
