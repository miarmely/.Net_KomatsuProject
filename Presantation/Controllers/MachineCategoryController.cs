using Entities.DtoModels.CategoryDtos;
using Entities.QueryParameters;
using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;
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
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> AddMainAndSubcategories(
			[FromQuery] LanguageParams languageParam,
			[FromBody] CategoryDtoForAddMainAndSubcategories categoryDto)
		{
			await _services.MachineCategoryService
				.AddMainAndSubcategoriesAsync(categoryDto, languageParam);

			return NoContent();
		}


		[HttpPost("subcategory/add")]
		[Authorization("Admin,Editor,Yönetici,Editör")]
		public async Task<IActionResult> AddSubcategories(
			[FromQuery] LanguageParams languageParam,
			[FromBody] CategoryDtoForAddSubcategories categoryDto)
		{
			await _services.MachineCategoryService
				.AddSubcategoriesAsync(categoryDto, languageParam);

			return NoContent();
		}


		[HttpGet("mainAndSubcategory/display/all")]
		[Authorization]
		public async Task<IActionResult> GetAllMainAndSubcategories()
		{
			var entity = await _services.MachineCategoryService
				.GetAllMainAndSubcategoriesAsync();

			return Ok(entity);
		}


		[HttpPost("mainAndSubcategory/update")]
		public async Task<IActionResult> UpdateMainAndSubcategories(
			[FromQuery] LanguageParams languageParams,
			[FromBody] CategoryDtoForUpdateMainAndSubcategories categoryDto)
		{
			await _services.MachineCategoryService
				.UpdateMainAndSubcategoriesAsync(languageParams, categoryDto);

			return NoContent();
		}


		[HttpPost("maincategory/delete")]
		public async Task<IActionResult> DeleteMainCategory(
			[FromQuery] LanguageParams languageParams,
			[FromBody] CategoryDtoForDeleteMainCategory categoryDto)
		{
			await _services.MachineCategoryService
			   .DeleteMainCategoryAsync(languageParams, categoryDto);

			return NoContent();
		}


		[HttpPost("subcategory/delete")]
		public async Task<IActionResult> DeleteSubcategories(
			[FromQuery] LanguageParams languageParams,
			[FromBody] CategoryDtoForDeleteSubcategories categoryDto)
		{
			await _services.MachineCategoryService
			   .DeleteSubCategoriesAsync(languageParams, categoryDto);

			return NoContent();
		}
	}
}