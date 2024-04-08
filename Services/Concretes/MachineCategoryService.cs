using Dapper;
using Entities.DtoModels;
using Entities.DtoModels.CategoryDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;
using System.Runtime.InteropServices;

namespace Services.Concretes
{
	public class MachineCategoryService : IMachineCategoryService
	{
		private readonly IRepositoryManager _repos;

		public MachineCategoryService(IRepositoryManager repos)
		{
			_repos = repos;
		}

		public async Task AddMainAndSubcategoriesAsync(
			CategoryDtoForAddMainAndSubcategories categoryDto,
			LanguageParams languageParams)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				Language = languageParams.Language,
				MainCategoryInEN = categoryDto.MainCategoryInEN,
				MainCategoryInTR = categoryDto.MainCategoryInTR,
				SubCategoriesInTR = string.Join(',', categoryDto.SubcategoriesInTR),
				SubCategoriesInEN = string.Join(',', categoryDto.SubcategoriesInEN),
				SplitChar = ','
			});
			#endregion

			#region add main and subcategories
			var errorDto = await _repos.MachineCategoryRepository
				.AddMainAndSubcategoriesAsync(parameters);

			// when any error is occured
			if (errorDto.StatusCode != 204)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task<IEnumerable<CategoryView>> GetAllMainAndSubcategoriesAsync()
		{
			#region get all main category and subcategories
			// EXPECTING: categoryDict = { BaseMainCategoryName : CategoryView... }
			var categoryDict = new Dictionary<string, CategoryView>();

			var categoryViews = await _repos.MachineCategoryRepository
				.GetAllMainAndSubcategoriesAsync(
					(mainCatPart, subCatPart) =>
					{
						#region when base main category is not exists in dict
						if (!categoryDict.TryGetValue(
								mainCatPart.BaseMainCategoryName,
								out var categoryView))
						{
							categoryView = new CategoryView()
							{
								BaseMainCategoryName = mainCatPart
									.BaseMainCategoryName
							};

							categoryDict.Add(
								mainCatPart.BaseMainCategoryName,
								categoryView);
						}
						#endregion

						#region when main and subcats list is not exists belong to language
						var mainAndSubcatsByLang = categoryView.MainAndSubcatsByLangs
							.FirstOrDefault(m => m.Language
								.Equals(mainCatPart.Language));

						// if not exists, create
						if (mainAndSubcatsByLang == null)
						{
							mainAndSubcatsByLang = new MainAndSubcategoriesByLanguage
							{
								Language = mainCatPart.Language,
								MainCategoryName = mainCatPart.MainCategoryName,
							};

							categoryView.MainAndSubcatsByLangs
								.Add(mainAndSubcatsByLang);
						}
						#endregion

						#region add subcategories belong to language
						if (subCatPart != null)
							mainAndSubcatsByLang.SubcategoryNames
								.Add(subCatPart.SubcategoryName);
						#endregion

						return categoryView;
					},
					"SubCategoryName");
			#endregion

			#region when any main category not found (THROW)
			if (categoryViews.Count() == 0)
				throw new ErrorWithCodeException(
					404,
					"NF-MC-M",
					"Not Found - Machine Category - Main Category",
					"not found main category");
			#endregion

			return categoryDict.Values;
		}

		public async Task UpdateMainCategoryAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateMainCategory categoryDto)
		{
			#region set parameters
			var parameters = new DynamicParameters(categoryDto);

			parameters.Add("Language", languageParams.Language, DbType.String);
			#endregion

			#region update main category (THROW)
			var errorDto = await _repos.MachineCategoryRepository
				.UpdateMainCategoryAsync(parameters);

			// when any error occurs
			if (errorDto.ErrorCode != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task UpdateSubcategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateSubcategories categoryDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.AddDynamicParams(new
			{
				Language = languageParams.Language,
				OldMainCategoryInEN = categoryDto.OldMainCategoryInEN,
				OldSubCategoriesInEN = string.Join(",", categoryDto.OldSubCategoriesInEN),

				OldSubCategoriesInTR = categoryDto.OldSubCategoriesInTR != null ?
					string.Join(",", categoryDto.OldSubCategoriesInTR)
					: null,

				NewSubCategoriesInEN = categoryDto.NewSubCategoriesInEN != null ?
					string.Join(",", categoryDto.NewSubCategoriesInEN)
					: null,

				NewSubCategoriesInTR = categoryDto.NewSubCategoriesInTR != null ?
					string.Join(",", categoryDto.NewSubCategoriesInTR)
					: null,

				SplitChar = ','
			});
			#endregion

			#region update main category (THROW)
			var errorDto = await _repos.MachineCategoryRepository
				.UpdateSubcategoriesAsync(parameters);

			// when any error occurs
			if (errorDto.ErrorCode != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task UpdateMainAndSubcategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateMainAndSubcategories categoryDto)
		{
			#region when only main category is changed
			ErrorDto? errorDto = null;

			if ((categoryDto.NewMainCategoryInEN != null
					|| categoryDto.NewMainCategoryInTR != null)
				&& !(categoryDto.NewSubCategoriesInEN != null
					|| categoryDto.NewSubCategoriesInTR != null))
			{
				#region set parameters
				var parameters = new DynamicParameters();

				parameters.AddDynamicParams(new
				{
					Language = languageParams.Language,
					OldMainCategoryInEN = categoryDto.OldMainCategoryInEN,
					NewMainCategoryInEN = categoryDto.NewMainCategoryInEN,
					NewMainCategoryInTR = categoryDto.NewMainCategoryInTR,
				});
				#endregion

				errorDto = await _repos.MachineCategoryRepository
					.UpdateMainCategoryAsync(parameters);
			}
			#endregion

			#region when only subcategory is changed
			if (!(categoryDto.NewMainCategoryInEN != null
					|| categoryDto.NewMainCategoryInTR != null)
				&& (categoryDto.NewSubCategoriesInEN != null
					|| categoryDto.NewSubCategoriesInTR != null))
			{
				#region set parameters
				var parameters = new DynamicParameters();

				parameters.AddDynamicParams(new
				{
					Language = languageParams.Language,
					OldMainCategoryInEN = categoryDto.OldMainCategoryInEN,
					#region OldSubCategoriesInEN
					OldSubCategoriesInEN = string
						.Join(",", categoryDto.OldSubCategoriesInEN),
					#endregion
					#region OldSubCategoriesInTR
					OldSubCategoriesInTR = categoryDto.OldSubCategoriesInTR != null ?
						string.Join(",", categoryDto.OldSubCategoriesInTR)
						: null,
					#endregion
					#region NewSubCategoriesInEN
					NewSubCategoriesInEN = categoryDto.NewSubCategoriesInEN != null ?
						string.Join(",", categoryDto.NewSubCategoriesInEN)
						: null,
					#endregion
					#region NewSubCategoriesInTR
					NewSubCategoriesInTR = categoryDto.NewSubCategoriesInTR != null ?
						string.Join(",", categoryDto.NewSubCategoriesInTR)
						: null,
					#endregion
					SplitChar = ','
				});
				#endregion

				errorDto = await _repos.MachineCategoryRepository
					.UpdateSubcategoriesAsync(parameters);
			}
			#endregion

			#region when main and subcategory is changed
			else
			{
				#region set parameters
				var parameters = new DynamicParameters();

				parameters.AddDynamicParams(new
				{
					Language = languageParams.Language,
					OldMainCategoryInEN = categoryDto.OldMainCategoryInEN,
					#region OldSubCategoriesInEN
					OldSubCategoriesInEN = categoryDto.OldSubCategoriesInEN != null ?
						string.Join(",", categoryDto.OldSubCategoriesInEN)
						: null,
					#endregion
					#region OldSubCategoriesInTR
					OldSubCategoriesInTR = categoryDto.OldSubCategoriesInTR != null ?
						string.Join(",", categoryDto.OldSubCategoriesInTR)
						: null,
					#endregion
					NewMainCategoryInEN = categoryDto.NewMainCategoryInEN,
					NewMainCategoryInTR = categoryDto.NewMainCategoryInTR,
					#region NewSubCategoriesInEN
					NewSubCategoriesInEN = categoryDto.NewSubCategoriesInEN != null ?
						string.Join(",", categoryDto.NewSubCategoriesInEN)
						: null,
					#endregion
					#region NewSubCategoriesInTR
					NewSubCategoriesInTR = categoryDto.NewSubCategoriesInTR != null ?
						string.Join(",", categoryDto.NewSubCategoriesInTR)
						: null,
					#endregion
					SplitChar = ','
				});
				#endregion

				errorDto = await _repos.MachineCategoryRepository
					.UpdateMainAndSubcategoriesAsync(parameters);
			}
			#endregion

			#region when any error occurs  (THROW)
			if (errorDto.ErrorCode != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task DeleteMainCategoryAsync(
			LanguageParams languageParams,
			CategoryDtoForDeleteMainCategory categoryDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.AddDynamicParams(new
			{
				languageParams.Language,
				categoryDto.MainCategoryInEN
			});
			#endregion

			#region delete machine category (THROW)
			var errorDto = await _repos.MachineCategoryRepository
				.DeleteMainCategoryAsync(parameters);

			// when any error occures
			if (errorDto.ErrorCode != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}

		public async Task DeleteSubCategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForDeleteSubcategories categoryDto)
		{
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.AddDynamicParams(new
			{
				Language = languageParams.Language,
				MainCategoryInEN = categoryDto.MainCategoryInEN,

				SubcategoriesInEN = categoryDto.SubcategoriesInEN != null ?
					string.Join(',', categoryDto.SubcategoriesInEN)
					: null,

				SplitChar = ','
			});
			#endregion

			#region delete sub categories (THROW)
			var errorDto = await _repos.MachineCategoryRepository
				.DeleteSubcategoryAsync(parameters);

			// when any error occures
			if (errorDto.ErrorCode != null)
				throw new ErrorWithCodeException(errorDto);
			#endregion
		}
	}
}