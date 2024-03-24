using AutoMapper;
using Entities.DtoModels.UserDtos;
using Entities.ViewModels;

namespace Temsa_Api.Utilities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserView, UserDto>();
            CreateMap<UserDtoForRegister, UserDtoForCreate>();
        }
    }
}
