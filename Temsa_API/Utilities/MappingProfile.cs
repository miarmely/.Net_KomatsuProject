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
			CreateMap<UserDtoForCreate, UserDto>();
			CreateMap<UserDtoForRegister, UserDto>();

            CreateMap<UserDtoForRegister, User>();
            CreateMap<UserDtoForCreate, User>();

            CreateMap<UserDtoForRegister, UserDtoForConflictControl>();
            CreateMap<UserDtoForCreate, UserDtoForConflictControl>();
            CreateMap<UserDtoForUpdate, UserDtoForConflictControl>();

            CreateMap<ErrorDetails, ErrorDto>();
            CreateMap<MachineDtoForCreate, MachineDto>();
        }
	}
}
