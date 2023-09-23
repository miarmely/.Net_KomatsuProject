using Entities.DataModels;
using Entities.Exceptions;
using Repositories.Contracts;
using Services.Contracts;

namespace Services.Concretes
{
    public class RoleService : IRoleService
    {
        private readonly IRepositoryManager _manager;

        public RoleService(IRepositoryManager manager) =>
            _manager = manager;
         
        //public async Task<IEnumerable<string>> GetAllRolesAsync()
        //{
        //    #region when any role not found (throw)
        //    var roles = await _manager.RoleRepository
        //        .GetAllRolesAsync();

        //    if (roles.Count == 0)
        //        throw new ErrorWithCodeException(404,
        //            "NF-R",
        //            "Not Found - Register");
        //    #endregion

        //    #region return roleNames
        //    var roleNames = roles.Select(r => r.Name);
           
        //    return roleNames;
        //    #endregion
        //}
    }
}
