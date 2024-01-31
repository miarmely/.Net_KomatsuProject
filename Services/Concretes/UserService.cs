using AutoMapper;
using Dapper;
using Entities.ConfigModels;
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
	public partial class UserService : IUserService
	{
		private readonly IRepositoryManager _manager;
		private readonly IConfigManager _configs;
		private readonly IMapper _mapper;

		public UserService(IRepositoryManager manager,
			IConfigManager config,
			IMapper mapper)
		{
			_manager = manager;
			_configs = config;
			_mapper = mapper;
		}

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

		private async Task<string> GenerateTokenForUserAsync(UserView userView)
		{
			#region set claims
			var claims = new Collection<Claim>
			{
				new (ClaimTypes.NameIdentifier, userView.UserId.ToString()),
				new (ClaimTypes.Name, userView.FirstName),
				new (ClaimTypes.Surname, userView.LastName),
				new (ClaimTypes.MobilePhone, userView.TelNo),
				new (ClaimTypes.Email, userView.Email),
				new ("CompanyName", userView.CompanyName),
			};

			#region add roles of user to claims
			foreach (var roleName in userView.RoleNames)
				claims.Add(new Claim(
					ClaimTypes.Role,
					roleName));
			#endregion

			#endregion

			#region set signingCredentials
			var secretKeyInBytes = Encoding.UTF8
				.GetBytes(_configs.JwtSettings.SecretKey);

			var signingCredentials = new SigningCredentials(
				new SymmetricSecurityKey(secretKeyInBytes),
				SecurityAlgorithms.HmacSha256);
			#endregion

			#region set jwt token
			var token = new JwtSecurityToken(
				issuer: _configs.JwtSettings.ValidIssuer,
				audience: _configs.JwtSettings.ValidAudience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(_configs.JwtSettings.Expires),
				signingCredentials: signingCredentials);
			#endregion

			return new JwtSecurityTokenHandler()
				.WriteToken(token);
		}

		private async Task<UserView> LoginAsync(
			string language,
			UserDtoForLogin userDto)
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

			#region get user view
			var userView = await _manager.UserRepository
				.LoginAsync(parameters);
			#endregion

			#region when telNo or password is wrong (throw)
			if (userView == null)
				throw new ErrorWithCodeException(
					parameters.Get<Int16>("StatusCode"),
					parameters.Get<string>("ErrorCode"),
					parameters.Get<string>("ErrorDescription"),
					parameters.Get<string>("ErrorMessage"));
			#endregion

			return userView;
		}
	}

	public partial class UserService
	{
		public async Task<string> LoginForMobileAsync(
			string language,
			UserDtoForLogin userDto)
		{
			var userView = await LoginAsync(language, userDto);

			return await GenerateTokenForUserAsync(userView);
		}

		public async Task<string> LoginForWebAsync(
			string language,
			UserDtoForLogin userDto)
		{
			var userView = await LoginAsync(language, userDto);

			#region when user role invalid for login to admin panel (throw)
			if (!userView.RoleNames.Any(r => _configs
				.LoginSettings
				.RolesCanBeLoginToAdminPanel
				.Contains(r)))
			{
				throw new ErrorWithCodeException(ErrorDetailsConfig
					.ToErrorDto(
						language,
						_configs.ErrorDetails.AE_F));
			}
			#endregion

			return await GenerateTokenForUserAsync(userView);
		}

		public async Task RegisterAsync(
			string language,
			UserDtoForRegister userDto)
		{
			var userDtoForCreate = _mapper.Map<UserDtoForCreate>(userDto);

			await CreateUserAsync(language, userDtoForCreate);
		}

		public async Task CreateUserAsync(
			string language,
			UserDtoForCreate userDto)
		{
			#region set parameters

			#region sort roleNames if entered
			if (userDto.RoleNames != null
				&& userDto.RoleNames.Count() > 1)
				userDto.RoleNames.Sort();
			#endregion

			#region set parameters
			var parameters = new DynamicParameters(new
			{
				FirstName = userDto.FirstName,
				LastName = userDto.LastName,
				CompanyName = userDto.CompanyName,
				TelNo = userDto.TelNo,
				Email = userDto.Email,
				Password = await ComputeMd5Async(userDto.Password),
				RoleNames = string.Join(",", userDto.RoleNames) // list to string 
			});

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
			LanguageAndPagingParams queryParams,
			HttpResponse response)
		{
			#region set parameters
			var parameters = new DynamicParameters(queryParams);

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
			var userViewsInPagingList = await PagingList<UserView>
				.ToPagingListAsync(
					userViews,
					parameters.Get<int>("TotalCount"),
					queryParams.PageNumber,
					queryParams.PageSize);
			#endregion

			#region add infos to headers
			response.Headers.Add(
				"User-Pagination",
				await userViewsInPagingList.GetMetaDataForHeadersAsync());
			#endregion

			#endregion

			return _mapper.Map<IEnumerable<UserDto>>(userViews);
		}

		public async Task<IEnumerable<string>> GetAllRolesByLanguageAsync(string language)
		{
			#region get roles
			var parameters = new DynamicParameters();
			parameters.Add("Language", language, DbType.String);

			return await _manager.UserRepository
				.GetAllRolesByLanguageAsync(parameters);
			#endregion
		}

		public async Task UpdateUserByTelNoAsync(
			string language,
			string telNo,
			UserDtoForUpdate userDto)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				TelNoForValidation = telNo,
				userDto.FirstName,
				userDto.LastName,
				userDto.CompanyName,
				userDto.TelNo,
				userDto.Email,
				#region Password
				Password = userDto.Password == null ?
					null
					: await ComputeMd5Async(userDto.Password),
				#endregion
				userDto.RoleNames
			});

			parameters.Add("Language", language, DbType.String);
			#endregion

			#region update user (throw)
			var errorDto = await _manager.UserRepository
				.UpdateUserByTelNoAsync(parameters);

			// when any error occured
			if (errorDto != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task DeleteUsersByTelNoListAsync(
			string language,
			UserDtoForDelete userDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();
			parameters.Add("Language", language, DbType.String);

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
	} // main services
}