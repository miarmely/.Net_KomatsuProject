using AutoMapper;
using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.UserDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Collections.ObjectModel;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace Services.Concretes
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _manager;
        private readonly IConfigManager _config;
        private readonly IMapper _mapper;
        
        public UserService(IRepositoryManager manager,
            IConfigManager config,
            IMapper mapper)
        {
            _manager = manager;
            _config = config;
            _mapper = mapper;
        }

        public async Task<string> LoginAsync(string language, UserDtoForLogin userDto)
        {
            #region set paramaters
            var parameters = new DynamicParameters();
            var hashedPassword = await ComputeMd5Async(userDto.Password);

            parameters.Add("Language", language, DbType.String);
            parameters.Add("TelNo", userDto.TelNo, DbType.String);
            parameters.Add("Password", hashedPassword, DbType.String);
            parameters.Add("StatusCode", 0, DbType.Int16, ParameterDirection.Output);
            parameters.Add("ErrorCode", "", DbType.String, ParameterDirection.Output);
            parameters.Add("ErrorMessage", "", DbType.String, ParameterDirection.Output);
            parameters.Add("ErrorDescription", "", DbType.String, ParameterDirection.Output);
            #endregion

            #region login (throw)
            var userView = await _manager.UserRepository
                .LoginAsync(parameters);

            // when telNo or password is wrong (throw)
            if (userView == null)
                throw new ErrorWithCodeException(
                    parameters.Get<Int16>("StatusCode"),
                    parameters.Get<string>("ErrorCode"),
                    parameters.Get<string>("ErrorDescription"),
                    parameters.Get<string>("ErrorMessage"));
            #endregion

            return await GenerateTokenForUserAsync(userView);
        }

        public async Task RegisterAsync(string language, UserDtoForRegister userDto)
        {
            var userDtoForCreate = _mapper.Map<UserDtoForCreate>(userDto);

            await CreateUserAsync(language, userDtoForCreate);
        }

        public async Task CreateUserAsync(string language, UserDtoForCreate userDto)
        {
            #region set parameters

            #region sort roleNames if entered
            if (userDto.RoleNames != null)
                userDto.RoleNames.Sort();
            #endregion

            #region set parameters
            var userDtoForProc = new UserDtoForCreateProcedure
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                CompanyName = userDto.CompanyName,
                TelNo = userDto.TelNo,
                Email = userDto.Email,
                Password = await ComputeMd5Async(userDto.Password),
                RoleNames = string.Join(", ", userDto.RoleNames) // list to string 
            };
            var parameters = new DynamicParameters(userDtoForProc);

            parameters.Add("Language", language, DbType.String);
            #endregion

            #endregion

            #region create user (throw)
            var errorDto = await _manager.UserRepository
                .CreateUserAsync(parameters);
            
            // when any error occured
            if (errorDto != null)
                throw new ErrorWithCodeException(errorDto);
            #endregion
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
            PaginationParameters pagingParameters,
            string language,
            HttpResponse response)
        {
            #region set parameters
            var parameters = new DynamicParameters(pagingParameters);

            parameters.Add("Language", language, DbType.String);
            parameters.Add("TotalCount", 0, DbType.Int32, ParameterDirection.Output);
            #endregion

            #region get userViews
            var userViews = await _manager.UserRepository
                .GetAllUsersWithPagingAsync(parameters);
            #endregion

            #region when any userView not found (throw)
            if (userViews.Count() == 0)
                throw new ErrorWithCodeException(404,
                    "NF-U",
                    "Not Found - User");
            #endregion

            #region add pagination infos to headers

            #region convert userViews to pagingList
            var userViewsInPagingList = await PagingList<UserView>.ToPagingListAsync(
                userViews,
                parameters.Get<int>("TotalCount"),
                pagingParameters.PageNumber,
                pagingParameters.PageSize);
            #endregion

            #region add infos to headers
            response.Headers.Add(
                "User-Pagination",
                userViewsInPagingList.GetMetaDataForHeaders());
            #endregion

            #endregion

            return _mapper.Map<IEnumerable<UserDto>>(userViews);
        }

        public async Task UpdateUserByTelNoAsync(
            string telNo,
            UserDtoForUpdate userDto)
        {
            #region set parameters

            #region sort roleNames if entered
            if (userDto.RoleNames != null  // when role name entered
                && userDto.RoleNames.Count > 1)  // when role names more than 1
                userDto.RoleNames.Sort();
            #endregion

            #region set parameters
            var userDtoForProc = new UserDtoForUpdateProcedure
            {
                TelNoForValidation = telNo,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                CompanyName = userDto.CompanyName,
                TelNo = userDto.TelNo,
                Email = userDto.Email,
                #region Password
                Password = userDto.Password == null ?
                    null
                    : await ComputeMd5Async(userDto.Password),
                #endregion
                #region RoleNames
                RoleNames = userDto.RoleNames == null ?
                    null
                    : string.Join(", ", userDto.RoleNames)
                #endregion
            };
            var parameters = new DynamicParameters(userDtoForProc);
            #endregion

            #endregion

            #region update user (throw)
            var errorDto = await _manager.UserRepository
                .UpdateUserByTelNoAsync(parameters);
            
            // when any error occured
            if (errorDto != null)
                throw new ErrorWithCodeException(errorDto);
            #endregion
        }

        public async Task DeleteUsersByTelNoListAsync(UserDtoForDelete userDto)
        {
            #region set parameters
            var parameters = new DynamicParameters();

            parameters.Add(
                "TelNosInString",
                string.Join(',', userDto.TelNoList),
                DbType.String);

            parameters.Add(
                "TotalTelNoCount",
                userDto.TelNoList.Count(),
                DbType.Int32);
            #endregion

            #region delete users in list
            var errorDto = await _manager.UserRepository
                .DeleteUsersByTelNoListAsync(parameters);

            // when any error occured
            if (errorDto != null)
                throw new ErrorWithCodeException(errorDto);
            #endregion
        }


        #region private

        private async Task<string> ComputeMd5Async(string input) =>
            await Task.Run(() =>
            {
                using (var md5 = MD5.Create())
                {
                    #region do hash to input
                    var hashInBytes = md5.ComputeHash(Encoding.UTF8
                        .GetBytes(input));

                    var hashAsString = Convert.ToBase64String(hashInBytes);
                    #endregion

                    return hashAsString;
                }
            });

        private async Task<string> GenerateTokenForUserAsync(UserView userView) =>
            await Task.Run(() => {
                #region set claims
                var claims = new Collection<Claim>
                {
                    new (ClaimTypes.MobilePhone, userView.TelNo),
                    new (ClaimTypes.Email, userView.Email),
                    new (ClaimTypes.Name, userView.FirstName),
                    new (ClaimTypes.Surname, userView.LastName),
                };

                #region add roles of user to claims
                foreach (var roleName in userView.RoleNames)
                    claims.Add(
                        new Claim(ClaimTypes.Role, roleName));
                #endregion

                #endregion

                #region set signingCredentials
                var secretKeyInBytes = Encoding.UTF8
                    .GetBytes(_config.JwtSettings.SecretKey);

                var signingCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(secretKeyInBytes),
                    SecurityAlgorithms.HmacSha256);
                #endregion

                #region set jwt token
                var token = new JwtSecurityToken(
                    issuer: _config.JwtSettings.ValidIssuer,
                    audience: _config.JwtSettings.ValidAudience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(_config.JwtSettings.Expires),
                    signingCredentials: signingCredentials);
                #endregion

                return new JwtSecurityTokenHandler()
                    .WriteToken(token);
            });
            
        #endregion
    }
}