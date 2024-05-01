using Dapper;
using Entities.DtoModels;
using Entities.DtoModels.CategoryDtos;
using Entities.Exceptions;
using Entities.QueryParameters;
using Entities.ViewModels;
using Repositories.Contracts;
using Services.Contracts;
using System.Data;
using System.Threading.Channels;


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
				throw new ExceptionWithMessage(errorDto);
			#endregion
		}

		public async Task AddSubcategoriesAsync(
			CategoryDtoForAddSubcategories categoryDto,
			LanguageParams languageParams)
		{
			#region set parameters
			var parameters = new DynamicParameters(new
			{
				Language = languageParams.Language,
				MainCategoryInEN = categoryDto.MainCategoryInEN,
				SubCategoriesInTR = string.Join(',', categoryDto.SubcategoriesInTR),
				SubCategoriesInEN = string.Join(',', categoryDto.SubcategoriesInEN),
				SplitChar = ','
			});
			#endregion

			#region add main and subcategories
			var errorDto = await _repos.MachineCategoryRepository
				.AddSubcategoriesAsync(parameters);

			// when any error is occured
			if (errorDto.StatusCode != 204)
				throw new ExceptionWithMessage(errorDto);
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
				throw new ExceptionWithMessage(
					404,
					"NF-MC-M",
					"Not Found - Machine Category - Main Category",
					"not found main category");
			#endregion

			return categoryDict.Values;
		}

		public async Task UpdateMainAndSubcategoriesAsync(
			LanguageParams languageParams,
			CategoryDtoForUpdateMainAndSubcategories categoryDto)
		{
			#region when only subcategory or main and subcategory is changed
			ErrorDtoWithMessage? errorDto = null;

			if (categoryDto.NewSubCategoriesInEN != null
				|| categoryDto.NewSubCategoriesInTR != null)
			{
				#region set new subcategories parameters

				#region set "newSubcategoriesInEN"
				var newSubcategoriesInEN = new List<string>();

				if (categoryDto.NewSubCategoriesInEN != null)
					// if old subcategory is changed, add new subcategory to "newSubcategoriesInEN";
					// is not changed, add old subcategory to "newSubcategoriesInEN"
					foreach (var oldSubcatInEN in categoryDto.OldSubCategoriesInEN)
					{
						#region when "oldSubcatInEN" is updated
						var infoOfChangedSubcat = categoryDto.NewSubCategoriesInEN
							.FirstOrDefault(s => s.OldValue.Equals(oldSubcatInEN));

						if (infoOfChangedSubcat != null)
							newSubcategoriesInEN.Add(infoOfChangedSubcat.NewValue);
						#endregion

						#region when "oldSubcatInEN" is not updated
						else
							newSubcategoriesInEN.Add(oldSubcatInEN);
						#endregion
					}

				// EX:  OldSubCategoriesInEN = [A, B, C],  NewSubcategoriesInEN = [A11, C11]
				//		=> newSubcategoriesInEN = [A11, B, C11] 
				#endregion

				#region set "newSubcategoriesInTR"
				var newSubcategoriesInTR = new List<string>();

				if (categoryDto.NewSubCategoriesInTR != null)
					// if old subcategory is changed, add new subcategory to "newSubcategoriesInTR";
					// is not changed, add old subcategory to "newSubcategoriesInTR"
					foreach (var oldSubcatInTR in categoryDto.OldSubCategoriesInTR)
					{
						#region when "oldSubcatInTR" is updated
						var infoOfChangedSubcat = categoryDto.NewSubCategoriesInTR
							.FirstOrDefault(s => s.OldValue.Equals(oldSubcatInTR));

						if (infoOfChangedSubcat != null)
							newSubcategoriesInTR.Add(infoOfChangedSubcat.NewValue);
						#endregion

						#region when "oldSubcatInTR" is not updated
						else
							newSubcategoriesInTR.Add(oldSubcatInTR);
						#endregion
					}

				#endregion

				#endregion

				#region when main category is changed too  (UPDATE MAIN + SUB)
				if (categoryDto.NewMainCategoryInEN != null
					|| categoryDto.NewMainCategoryInTR != null)
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
							string.Join(",", newSubcategoriesInEN)
							: null,
						#endregion
						#region NewSubCategoriesInTR
						NewSubCategoriesInTR = categoryDto.NewSubCategoriesInTR != null ?
							string.Join(",", newSubcategoriesInTR)
							: null,
						#endregion
						SplitChar = ','
					});
					#endregion

					errorDto = await _repos.MachineCategoryRepository
						.UpdateMainAndSubcategoriesAsync(parameters);
				}
				#endregion

				#region when only subcategory is changed  (UPDATE SUB)
				else
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
							string.Join(",", newSubcategoriesInEN)
							: null,
						#endregion
						#region NewSubCategoriesInTR
						NewSubCategoriesInTR = categoryDto.NewSubCategoriesInTR != null ?
							string.Join(",", newSubcategoriesInTR)
							: null,
						#endregion
						SplitChar = ','
					});
					#endregion

					errorDto = await _repos.MachineCategoryRepository
						.UpdateSubcategoriesAsync(parameters);
				}
				#endregion
			}
			#endregion

			#region when only main category is changed
			else if(categoryDto.NewMainCategoryInEN != null
				|| categoryDto.NewMainCategoryInTR != null)
			{
				#region set parameters
				var parameters = new DynamicParameters();

				parameters.AddDynamicParams(new
				{
					Language = languageParams.Language,
					OldMainCategoryNameInEN = categoryDto.OldMainCategoryInEN,
					NewMainCategoryNameInEN = categoryDto.NewMainCategoryInEN,
					NewMainCategoryNameInTR = categoryDto.NewMainCategoryInTR,
				});
				#endregion

				errorDto = await _repos.MachineCategoryRepository
					.UpdateMainCategoryAsync(parameters);
			}
			#endregion

			#region when any error occurs (THROW)
			if (errorDto.ErrorCode != null)
				throw new ExceptionWithMessage(errorDto);
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
				throw new ExceptionWithMessage(errorDto);
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
				throw new ExceptionWithMessage(errorDto);
			#endregion
		}
	}
}