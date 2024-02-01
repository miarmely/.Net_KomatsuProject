using Microsoft.AspNetCore.Http;


namespace MicroServices
{
    public interface IMicroService
    {
        Task<Guid> GetUserIdFromClaimsAsync(
            HttpContext context,
            string claimType);

        Task<string> ComputeMd5Async(string input);
    }
}
