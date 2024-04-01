using Entities.DtoModels.CategoryDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;


namespace Presantation.Controllers
{
	[Route("api/services/[controller]")]
	[ApiController]
	public class MachineCategoryController : ControllerBase
	{
        private readonly IServiceManager _services;

		public MachineCategoryController(IServiceManager services)
		{
			_services = services;
		}


		[HttpPost("mainAndSubcategory/add")]
		public async Task<IActionResult> AddMainAndSubcategories(
			[FromQuery] LanguageParams languageParam,
			[FromBody] CategoryDtoForAddMainAndSubcategories categoryDto)
		{
			await _services.MachineCategoryService
				.AddMainAndSubcategoriesAsync(categoryDto, languageParam);

			return NoContent();
		}
	}
}