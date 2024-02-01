using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using System.Text;

namespace MicroServices
{
    public class MicroService : IMicroService
    {
        public async Task<Guid> GetUserIdFromClaimsAsync(
            HttpContext context,
            string claimType)
        {
            #region get user id
            var userIdInStr = context.User.Claims.FirstOrDefault(c => c.Type
                .Equals(claimType))
                .Value;

            var userIdInGuid = Guid.Parse(userIdInStr);
            #endregion

            return userIdInGuid;
        }

        public async Task<string> ComputeMd5Async(string input)
        {
            using (var md5 = MD5.Create())
            {
                #region do hash to input
                var hashInBytes = md5.ComputeHash(
                    Encoding.UTF8.GetBytes(input));

                var hashAsString = Convert.ToBase64String(hashInBytes);
                #endregion

                return hashAsString;
            }
        }
    }
}