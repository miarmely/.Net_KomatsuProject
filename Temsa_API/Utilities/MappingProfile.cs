using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.ErrorModels;

namespace Temsa.Utilities
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<User, UserDto>();
			CreateMap<UserDtoForRegister, User>();
			CreateMap<ErrorDetails, ErrorDto>();
			CreateMap<MachineDtoForCreate, MachineDto>();
		}
	}
}
