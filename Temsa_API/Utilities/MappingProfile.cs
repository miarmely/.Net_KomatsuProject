using AutoMapper;
using Entities.DataModels;
using Entities.DtoModels;
using Entities.DtoModels.BodyModels;
using Entities.ViewModels;

namespace Temsa_Api.Utilities
{
    public class MappingProfile : Profile
	{
		public MappingProfile()
		{
            #region to ErrorDto
            CreateMap<ErrorDtoForExceptionFilter, ErrorDto>();
            #endregion

			#region to UserDto
            CreateMap<User, UserDto>();
			CreateMap<UserBodyDtoForCreate, UserDto>();
			CreateMap<UserView, UserDto>();
            #endregion

            #region to User
            CreateMap<UserBodyDtoForCreate, User>();
            #endregion

            #region to MachineDto
            CreateMap<MachineBodyDtoForCreate, MachineDto>();
			CreateMap<MachineBodyDtoForDisplay, MachineDto>();
            #endregion
        }
	}
}
