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
			// to UserDto
			CreateMap<User, UserDto>();
			CreateMap<UserDtoForCreate, UserDto>();
			CreateMap<UserDtoForRegister, UserDto>();

            // to User
            CreateMap<UserDtoForRegister, User>();
            CreateMap<UserDtoForCreate, User>();

			// to UserDtoForConflictControl
			CreateMap<UserDtoForRegister, UserDtoForConflictControl>();
            CreateMap<UserDtoForCreate, UserDtoForConflictControl>();
            CreateMap<UserDtoForUpdate, UserDtoForConflictControl>();

			// to ErrorDto
			CreateMap<ErrorDetails, ErrorDto>();
            CreateMap<MachineDtoForCreate, MachineDto>();

			// to MachineDto
			CreateMap<MachineDtoForDisplay, MachineDto>();
        }
	}
}
