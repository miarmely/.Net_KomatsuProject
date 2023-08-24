using AutoMapper;
using Entities.DataModels;
using Entities.ViewModels;

namespace Temsa.Utilities
{
	public class MappingProfile : Profile
	{
        public MappingProfile()
        {
            CreateMap<User, UserView>()
                .ForMember(
                    dst => dst.CompanyName,
                    opt => opt.AllowNull());  // leave as null to CompanyName
        }
    }
}
