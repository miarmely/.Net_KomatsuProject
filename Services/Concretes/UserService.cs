using AutoMapper;
using Dapper;
using Entities.ConfigModels;
using Entities.ConfigModels.Contracts;
using Entities.DtoModels.UserDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Miarmely.Services.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System.Collections.ObjectModel;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace Services.Concretes
{
	public partial class UserService  // private
		: IUserService
	{
		private readonly IRepositoryManager _manager;
		private readonly IConfigManager _configs;
		private readonly IMapper _mapper;
		private readonly IMiarService _miar;

		public UserService(IRepositoryManager manager,
			IConfigManager config,
			IMapper mapper,
			IMiarService miarServices)
		{
			_manager = manager;
			_configs = config;
			_mapper = mapper;
			_miar = miarServices;
		}

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
				claims.Add(
					new Claim(ClaimTypes.Role, roleName));
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
			var hashedPassword = await _miar.ComputeMd5Async(userDto.Password);

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
				throw new ExceptionWithMessage(
					parameters.Get<Int16>("StatusCode"),
					parameters.Get<string>("ErrorCode"),
					parameters.Get<string>("ErrorDescription"),
					parameters.Get<string>("ErrorMessage"));
			#endregion

			return userView;
		}

		private async Task UpdateUserAsync(DynamicParameters parameters)
		{
			#region update user (throw)
			var errorDto = await _manager.UserRepository
				.UpdateUserByTelNoAsync(parameters);

			// when any error occured
			if (errorDto != null)
				throw new ExceptionWithMessage(errorDto);
			#endregion
		}
	}


	public partial class UserService  // main services
	{
		public async Task<object> LoginForMobileAsync(
			string language,
			UserDtoForLogin userDto)
		{
			var userView = await LoginAsync(language, userDto);

			return new
			{
				UserId = userView.UserId,
				TelNo = userView.TelNo,
				Token = await GenerateTokenForUserAsync(userView),
			};
		}

		public async Task<string> LoginForWebAsync(
			string language,
			UserDtoForLogin userDto)
		{
			var userView = await LoginAsync(language, userDto);

			#region when user role invalid for login to panel (throw)
			if (!userView.RoleNames.Any(r => _configs
				.LoginSettings
				.RolesCanBeLoginToAdminPanel
				.Contains(r)))
			{
				throw new ExceptionWithMessage(ErrorDetailsConfig
					.ToErrorDto(
						language,
						_configs.ErrorDetails.AE_F));
			}
			#endregion

			return await GenerateTokenForUserAsync(userView);
		}

		public async Task<object> RegisterAsync(
			string language,
			UserDtoForRegister userDto)
		{
			#region add "user" role to user
			var userDtoForCreate = _mapper.Map<UserDtoForCreate>(userDto);

			if (language.Equals("TR"))
				userDtoForCreate.RoleNames.Add("Kullanıcı");

			else
				userDtoForCreate.RoleNames.Add("User");
			#endregion

			await CreateUserAsync(language, userDtoForCreate);

			return _manager.GetSuccessMessageByLanguages(language);
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
				Password = await _miar.ComputeMd5Async(userDto.Password),
				RoleNames = string.Join(",", userDto.RoleNames) // convert list to string 
			});

			parameters.Add("Language", language, DbType.String);
			#endregion

			#endregion

			#region create user (throw)
			var errorDto = await _manager.UserRepository
				.CreateUserAsync(parameters);

			// when any error occured
			if (errorDto != null)
				throw new ExceptionWithMessage(errorDto);
			#endregion
		}

		public async Task<IEnumerable<UserDto>> GetAllUsersWithPagingAsync(
			LanguageAndPagingParams queryParams,
			HttpResponse response)
		{
			#region set parameters
			var parameters = new DynamicParameters(queryParams);

			parameters.Add(
				"AccountId",
				await _miar.GetUserIdFromClaimsAsync(
					response.HttpContext,
					ClaimTypes.NameIdentifier),
				DbType.Guid);

			parameters.Add(
				"TotalCount",
				0,
				DbType.Int32,
				ParameterDirection.Output);
			#endregion

			#region get userViews
			var userViews = await _manager.UserRepository
				.GetAllUsersWithPagingAsync(parameters);
			#endregion

			#region when any userView not found (throw)
			if (userViews.Count() == 0)
				throw new ExceptionWithCode(
					404,
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

		public async Task<UserDto> GetUserByTelNoAsync(
			UserParamsForUpdate userParams)
		{
			#region get user  (THROW)
			var parameters = new DynamicParameters(userParams);

			var userView = await _manager.UserRepository
				.GetUserByTelNoAsync(parameters);

			// when user not found
			if (userView == null)
				throw new ExceptionWithCode(
					404,
					"NF-U",
					"Not Found - User");
			#endregion

			return _mapper.Map<UserDto>(userView);
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
			UserDtoForUpdateForPanel userDto)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				Language = language,
				TelNoForValidation = telNo,
				userDto.FirstName,
				userDto.LastName,
				userDto.CompanyName,
				userDto.TelNo,
				userDto.Email,
				#region Password
				Password = userDto.Password == null ?
					null
					: await _miar.ComputeMd5Async(userDto.Password),
				#endregion
				userDto.RoleNames
			});
			#endregion

			await UpdateUserAsync(parameters);
		}

		public async Task<object> UpdateUserByTelNoAsync(
			string language,
			string telNo,
			UserDtoForUpdateForMobile userDto)
		{
			#region set parameters  (don't add role names and password)
			var parameters = new DynamicParameters(new
			{
				Language = language,
				TelNoForValidation = telNo,
				userDto.FirstName,
				userDto.LastName,
				userDto.CompanyName,
				userDto.TelNo,
				userDto.Email
			});
			#endregion

			await UpdateUserAsync(parameters);

			return _manager.GetSuccessMessageByLanguages(language);
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
				throw new ExceptionWithMessage(errorDto);
			#endregion
		}

		public async Task<object> CloseAccountAsync(
			LanguageParams languageParams,
			HttpContext context)
		{
			#region set parameters
			var accountId = await _miar
				.GetUserIdFromClaimsAsync(context, ClaimTypes.NameIdentifier);

			var parameters = new DynamicParameters(new
			{
				Language = languageParams.Language,
				AccountId = accountId,
				RequestDate = DateTime.UtcNow,
			});
			#endregion

			#region close account (THROW)
			var errorDto = await _manager.UserRepository
				.CloseAccountAsync(parameters);

			// when any error occured
			if (errorDto.StatusCode != 204)
				throw new ExceptionWithMessage(errorDto);
			#endregion

			return _manager.GetSuccessMessageByLanguages(languageParams.Language);
		}
	}
}