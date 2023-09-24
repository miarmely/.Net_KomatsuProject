using AutoMapper;
using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.UserDtos;
using Entities.Exceptions;
using Entities.QueryModels;
using Microsoft.AspNetCore.Http;
using Repositories.Contracts;
using Services.Contracts;
using System.Security.Cryptography;
using System.Text;


namespace Services.Concretes
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _manager;
        private readonly IConfigManager _configManager;
        private readonly IMapper _mapper;
        private readonly IDtoConverterService _dtoConverterService;

        public UserService(IRepositoryManager manager,
            IConfigManager configManager,
            IMapper mapper,
            IDtoConverterService dtoConverterService)
        {
            _manager = manager;
            _configManager = configManager;
            _mapper = mapper;
            _dtoConverterService = dtoConverterService;
        }

        //public async Task<string> LoginAsync(UserBodyDtoForLogin UserDtoL)
        //{
        //	#region get userView by telNo
        //	var userView = await _manager.UserRepository
        //		.GetUserByTelNoAsync(UserDtoL.TelNo);
        //	#endregion

        //	#region when telNo not found (throw)
        //	_ = userView ?? throw new ErrorWithCodeException(404,
        //		"VE-U-T",
        //		"Verification Error - User - Telephone");
        //	#endregion

        //	#region when password is wrong (throw)
        //	var hashedPassword = await ComputeMd5Async(UserDtoL.Password);

        //	if (!userView.Password.Equals(hashedPassword))
        //		throw new ErrorWithCodeException(404,
        //			"VE-U-P",
        //			"Verification Error - User - Password");
        //	#endregion

        //	return await GenerateTokenForUserAsync(userView);
        //}

        public async Task CreateUserAsync(UserDtoForCreate userDto)
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
                #region RoleNames
                RoleNames = userDto.RoleNames == null ?
                    _configManager.UserSettings.DefaultRole  // set default role
                    : string.Join(", ", userDto.RoleNames)  // convert list to string
                #endregion
            };
            var parameters = new DynamicParameters(userDtoForProc);
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
            HttpResponse response)
        {
            #region get userViews
            var userViews = await _manager.UserRepository
                .GetAllUsersWithPagingAsync(pagingParameters);
            #endregion

            #region when any userView not found (throw)
            if (userViews.Count == 0)
                throw new ErrorWithCodeException(404,
                    "NF-U",
                    "Not Found - User");
            #endregion

            #region add pagination details to headers
            response.Headers.Add(
                "User-Pagination",
                userViews.GetMetaDataForHeaders());
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

        public async Task DeleteUsersByTelNoListAsync(UserDtoForDelete userDto) =>
            await _manager.UserRepository
                .DeleteUsersByTelNoListAsync(userDto.TelNoList);
        

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

        //private async Task<string> GenerateTokenForUserAsync(UserView userView)
        //{
        //	#region set claims
        //	var claims = new Collection<Claim>
        //	{
        //		new Claim("Id", userView.Id.ToString()),
        //		new Claim("FirstName", userView.FirstName),
        //		new Claim("LastName", userView.LastName)
        //	};

        //	#region add roles
        //	var roleNames = await _manager.UserAndRoleRepository
        //		.GetRoleNamesOfUserByUserIdAsync(userView.Id);

        //	foreach (var roleName in roleNames)
        //		claims.Add(
        //			new Claim("Role", roleName));
        //	#endregion

        //	#endregion

        //	#region set signingCredentials
        //	var secretKeyInBytes = Encoding.UTF8
        //			.GetBytes(_config.JwtSettings.SecretKey);

        //	var signingCredentials = new SigningCredentials(
        //		new SymmetricSecurityKey(secretKeyInBytes),
        //		SecurityAlgorithms.HmacSha256);
        //	#endregion

        //	#region set token
        //	var token = new JwtSecurityToken(
        //		issuer: _config.JwtSettings.ValidIssuer,
        //		audience: _config.JwtSettings.ValidAudience,
        //		claims: claims,
        //		expires: DateTime.Now.AddMinutes(_config.JwtSettings.Expires),
        //		signingCredentials: signingCredentials);
        //	#endregion

        //	return new JwtSecurityTokenHandler()
        //		.WriteToken(token);
        //}

        #endregion
    }
}