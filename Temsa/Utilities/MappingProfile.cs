using AutoMapper;
using Entities.DataModels;
using Entities.ViewModels;

namespace Temsa.Utilities
{
	public class MappingProfile : Profile
	{
        public MappingProfile()
        {
			CreateMap<User, UserView>();
			CreateMap<UserView, User>();
		}
	}
}
