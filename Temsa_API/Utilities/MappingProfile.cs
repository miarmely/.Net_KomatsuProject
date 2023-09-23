using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;

namespace Temsa.Utilities
{
    public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// to ErrorDto
			CreateMap<ErrorDtoForExceptionFilter, ErrorDto>();

			// to UserDto
			CreateMap<User, UserDto>();
			CreateMap<UserBodyDtoForCreate, UserDto>();
			
            // to User
            CreateMap<UserBodyDtoForCreate, User>();

			// to UserDtoForConflictControl
            CreateMap<UserBodyDtoForCreate, UserDtoForConflictControl>();
            CreateMap<UserBodyDtoForUpdate, UserDtoForConflictControl>();

			// to MachineDto
			CreateMap<MachineBodyDtoForCreate, MachineDto>();
			CreateMap<MachineBodyDtoForDisplay, MachineDto>();
        }
	}
}
