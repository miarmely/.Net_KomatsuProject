using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Services.Contracts;

namespace Temsa.Utilities
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<User, UserDto>();
			CreateMap<UserDtoForRegister, User>();
			
		}
	}
}
