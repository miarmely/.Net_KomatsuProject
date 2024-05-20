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
            CreateMap<UserDtoForRegister, UserDtoForCreate>()
                .ForMember(
                dest => dest.RoleNames,
                opt => opt.MapFrom(src => new List<string>()));
        }
    }
}
