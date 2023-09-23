using Entities.DataModels;
using Entities.DtoModels.QueryModels;
using Repositories.Contracts;

namespace Repositories.Concretes
{
    public class CompanyRepository : RepositoryBase<Company>, ICompanyRepository
	{
		public CompanyRepository(RepositoryContext context) : base(context)
		{ }
						
		//public async Task<Company?> GetCompanyByIdAsync(int id) =>
		//		await base
		//			.DisplayByCondition<Company>(c => c.Id == id)
		//			.SingleOrDefaultAsync();

		//public async Task<Company?> GetCompanyByNameAsync(string name) =>
		//		await base
  //                  .DisplayByCondition<Company>(c => c.Name.Equals(name))
		//			.SingleOrDefaultAsync();

  //      public async Task<PagingList<Company>> GetAllCompaniesAsync(
  //      PaginationQueryDto paginationQueryDto) =>
  //          await PagingList<Company>
  //              .ToPagingListAsync(
  //                  base.DisplayAll<Company>().OrderBy(c => c.Name),
  //                  paginationQueryDto.PageNumber,
  //                  paginationQueryDto.PageSize);
    }
}
