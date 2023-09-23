using AutoMapper;
using Dapper;
using Entities.ConfigModels.Contracts;
using Entities.DataModels.RelationModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.DtoModels.QueryModels;
using Entities.Exceptions;
using Entities.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using NLog.Filters;
using Repositories.Contracts;
using Services.Contracts;
using System.Collections.ObjectModel;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
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
		private readonly IDtoConverterService _dtoConverterService;

        public UserService(IRepositoryManager manager,
			IConfigManager config,
			IMapper mapper,
			IDtoConverterService dtoConverterService)
		{
			_manager = manager;
			_config = config;
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

		public async Task CreateUserAsync(UserBodyDtoForCreate userDtoC)
		{
            #region set parameters
            // set variables
            var parameters = new DynamicParameters();
            var hashedPassword = await ComputeMd5Async(userDtoC.Password);
            
			// set parameters
            parameters.Add("FirstName", userDtoC.FirstName, DbType.String);
            parameters.Add("LastName", userDtoC.LastName, DbType.String);
            parameters.Add("CompanyName", userDtoC.CompanyName, DbType.String);
            parameters.Add("TelNo", userDtoC.TelNo, DbType.String);
            parameters.Add("Email", userDtoC.Email, DbType.String);
            parameters.Add("Password", hashedPassword, DbType.String);
            parameters.Add("RoleName", userDtoC.RoleName, DbType.String);
            #endregion

            #region create user
            var errorDto = await _manager.UserRepository
				.CreateUserAsync(parameters);
			#endregion

			#region when error occured (throw)
			if (errorDto.ErrorCode != null)
                throw new ErrorWithCodeException(errorDto);
            #endregion
		}

        public async Task<IEnumerable<UserView>> GetAllUsersAsync()
		{
			var users = await _manager.UserRepository
				.GetAllUsersAsync();

			if (users == null)
				throw new ErrorWithCodeException(404, "NF-U", "Not Found - User");

			return users;
		}

        public async Task<IEnumerable<UserView>> GetAllUsersWithPagingAsync(
			PaginationQueryDto pagingParameters, 
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

			return userViews;
		}

		//public async Task UpdateUserAsync(string telNo, UserBodyDtoForUpdate userDtoU)
		//{
		//	#region update user
		//	string? statusCode = null;
		//	string? errorCode = null;
		//	string? errorDescription = null;

		//	await _manager.UserRepository
		//		.ExecProcedureAsync<string>($@" EXEC User_Update
		//			@TelNoForValidation = {telNo},
		//			@FirstName = {userDtoU.FirstName}
		//			@LastName = {userDtoU.LastName}
		//			@CompanyName = {userDtoU.CompanyName},
		//			@TelNo = {userDtoU.TelNo},
		//			@Email = {userDtoU.Email},
		//			@RoleName = {userDtoU.RoleName},
		//			@StatusCode = {statusCode} OUT,
		//			@ErrorCode = {errorCode} OUT,
		//			@ErrorDescription = {errorDescription} OUT");
		//	#endregion
		//}

		//public async Task DeleteUsersAsync(UserBodyDtoForDelete userDtoD)
		//{
		//	#region delete users
		//	var IsFalseTelNoExists = false;

		//	foreach (var telNo in userDtoD.TelNos)
		//	{
		//		#region get user by telNo
		//		var user = await _manager.UserRepository
		//			.GetUserByTelNoAsync(telNo);
		//		#endregion

		//		#region when telNo not found
		//		if (user == null)
		//		{
		//			IsFalseTelNoExists = true;
		//			break;
		//		}
		//		#endregion

		//		#region delete user
		//		_manager.UserRepository
		//			.Delete(user);
		//		#endregion

		//		#region delete userAndRoles of user
		//		var userAndRoles = await _manager.UserAndRoleRepository
		//			.GetUserAndRolesByUserIdAsync(user.Id);

		//		userAndRoles.ForEach(userAndRole =>
		//			_manager.UserAndRoleRepository
		//				.Delete(userAndRole)
		//		);
		//		#endregion
		//	}
		//	#endregion

		//	#region when any telNo not Found (throw)
		//	if (IsFalseTelNoExists)
		//		throw new ErrorWithCodeException(409,
		//			"VE-U-T",
		//			"Verification Error - Telephone");
		//	#endregion

		//	await _manager.SaveAsync();
		//}


		#region private

		private async Task<string> ComputeMd5Async(string input) =>
			await Task.Run(() =>
			{
				using (var md5 = MD5.Create())
				{
					#region hash to input
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