using Dapper;
using Entities.DtoModels.CategoryDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;


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
			// expecting => { TR : { İş Makineleri : CategoryView }... }
			var categoryDict = new Dictionary<string, Dictionary<string, CategoryView>>();

			var categoryViews = await _repos.MachineCategoryRepository
				.GetAllMainAndSubcategoriesAsync(
					(categoryView, subCatPart) =>
					{
						#region when language is not exists in dict
						if (!categoryDict.TryGetValue(
								categoryView.Language,
								out var categoriesByLang))
						{
							categoriesByLang = new Dictionary<string, CategoryView>();

							categoryDict.Add(
								categoryView.Language,
								categoriesByLang);

							// expecting => { TR : {}... }
						}
						#endregion

						#region when main category inside of language is not exists
						if (!categoriesByLang.TryGetValue(
								categoryView.MainCategoryName,
								out var categoryViewInDict))
						{
							categoryViewInDict = categoryView;

							categoriesByLang.Add(
								categoryView.MainCategoryName,
								categoryViewInDict);

							// expecting => { TR : { "İş Makineleri" : CategoryView... } }
							// NOTE: subcategory is not added yet.				
						}
						#endregion

						#region add subcategory of main category
						if(subCatPart != null)
							categoryViewInDict.SubCategoryNames
								.Add(subCatPart.SubCategoryName);

						// expecting => { TR : { "İş Makineleri" : CategoryView... } }
						// NOTE: subcategory is added.
						#endregion

						return categoryViewInDict;
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

			#region set categoryViewList
			var categoryViewList = new List<CategoryView>();

			// add all category views of languages to "categoryCiewList"
			foreach (var mainCatNameAndCatViewDict in categoryDict.Values)
				categoryViewList.AddRange(mainCatNameAndCatViewDict.Values);

			/* EXPECTING: 
			 *  categoryDict = { TR : { "A" : CategoryView, "B" : CategoryView },
			 *					 EN : { "C" : CategoryView, "D" : CategoryView } }
			 *
			 *	categoryViewList = [CatViewOfA, CatViewOfB, CatViewOfC, CatViewOfD] */

			#endregion

			return categoryViewList;
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
			#region set parameters
			var parameters = new DynamicParameters();

			parameters.AddDynamicParams(new
			{
				Language = languageParams.Language,
				OldMainCategoryInEN = categoryDto.OldMainCategoryInEN,
				
				OldSubCategoriesInEN = categoryDto.OldSubCategoriesInEN != null ?
					string.Join(",", categoryDto.OldSubCategoriesInEN)
					: null,

				OldSubCategoriesInTR = categoryDto.OldSubCategoriesInTR != null ?
					string.Join(",", categoryDto.OldSubCategoriesInTR)
					: null,

				NewMainCategoryInEN = categoryDto.NewMainCategoryInEN,
				NewMainCategoryInTR = categoryDto.NewMainCategoryInTR,

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
				.UpdateMainAndSubcategoriesAsync(parameters);

			// when any error occurs
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
			}) ;
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