import {
    getDataByAjaxOrLocalAsync, populateSelectAsync, updateElementText, updateResultLabel
} from "./miar_tools.js";

import { getValuesOfObject } from "./miar_module.dictionary.js";


$(function () {
    //#region variables
    const slct = {
        modes: $("#div_category_menubar select:nth-child(1)"),
        modeMenus: $("#div_category_menubar select:nth-child(2)"),
        categoryLanguage: $("#div_category_menubar .slct_categoryLanguage"),
        mainCatOnMainCatArticle: $(".div_category:nth-child(1) #slct_mainCategory"),
        mainCatOnSubcatArticle: $(".div_category:nth-child(2) #slct_mainCategory"),
        subcategory: $("#slct_subcategory"),
    };
    const h = {
        mainCategoryTitle: $(".div_category:nth-child(1) .h_articleTitle"),
        subcategoryTitle: $(".div_category:nth-child(2) .h_articleTitle"),
    };
    const div = {
        mainCategoryArticle: $(".div_category:nth-child(1)"),
        subcategoryArticle: $(".div_category:nth-child(2)"),
        mainCatSelectOnMainCatArticle: $(".div_category:nth-child(1) label[for='slct_mainCategory']").parent(),
        mainCatSelectOnSubcatArticle: $(".div_category:nth-child(2) label[for='slct_mainCategory']").parent(),
        newMainCategoryInput: $("label[for='inpt_newMainCategory']").parent(),
        newSubcategoryInput: $("label[for='inpt_newSubcategory']").parent(),
        subcategorySelect: $("label[for='slct_subcategory']").parent(),
        selectedMainCategory: $(".div_category:nth-child(1) .div_selectedCategories"),
        selectedSubcategory: $(".div_category:nth-child(2) .div_selectedCategories"),
        selectedCategories: $(".div_selectedCategories")
    };
    const btn = {
        send: $("#div_sendButton button"),
        selectOnMainCat: $("form .div_category:nth-child(1) .div_categoryButton button"),
        selectOnSubCat: $("form .div_category:nth-child(2) .div_categoryButton button"),
    };
    const inpt = {
        newMainCategory: $("#inpt_newMainCategory"),
        newSubcategory: $("#inpt_newSubcategory"),
    }
    const img = {
        loading: $("#img_loading")
    }
    const p_resultLabel_id = "p_resultLabel";
    const p_resultLabel = $("#" + p_resultLabel_id);
    const categoryType = {
        mainCat: "mainCategory",
        subcat: "subcategory"
    }
    let mode = "add";  // add | update | delete
    let categoryLanguage = language;
    let isCategoriesPopulatedToSelects = false;
    let selectedCatsByLangs = {
        mainCategory: {
            TR: {},
            EN: {}
        },
        subcategory: {
            TR: {},
            EN: {}
        },
    }
    let nextDivNos = {
        mainCategory: 0,
        subcategory: 0
    };  // for id of selected main/subcategory inputs
    let categoryInfos = [];
    let baseMainCatOfSelectedMainCats = null;
    //#endregion

    //#region events
    slct.modes.change(async () => {
        //#region resets
        resetMainCategoryArticle();
        resetSubcategoryArticle();
        p_resultLabel.empty();
        //#endregion

        //#region populate mode menus <select>
        mode = slct.modes.val();
        populateModeMenusSelect();
        //#endregion

        //#region change article title of main/subcategory
        updateElementText(
            h.mainCategoryTitle,
            langPack.article.mainCategoryTitleByMode[mode][language])  // main category article
        updateElementText(
            h.subcategoryTitle,
            langPack.article.subcategoryTitleByMode[mode][language])  // subcategory article
        //#endregion

        switch (mode) {
            case "add":
                await showCategoryArticleAsync(
                    { showMainCatSelect: false, showNewMainCatInput: true },
                    { showMainCatSelect: false, showSubcatSelect: false, showNewSubcatInput: true });

                break;
            case "update":
                await showCategoryArticleAsync(
                    { showMainCatSelect: true, showNewMainCatInput: true },
                    null);

                //#region populate categories <select>s if not populated
                if (!isCategoriesPopulatedToSelects)
                    await initializeMainAndSubcategoriesSelectAsync();
                //#endregion

                break;
            case "delete":
                await showCategoryArticleAsync(
                    { showMainCatSelect: true, showNewMainCatInput: false },
                    null);

                //#region populate categories <select>s if not populated
                if (!isCategoriesPopulatedToSelects)
                    await initializeMainAndSubcategoriesSelectAsync();
                //#endregion

                break;
        }
    })
    slct.modeMenus.change(async () => {
        resetCategoryArticles();

        //#region set main/subcategory articles by selected mode menu
        let selectedModeMenu = slct.modeMenus.val();

        switch (mode) {
            case "add":
                switch (selectedModeMenu) {
                    case "newCategory":
                        await showCategoryArticleAsync(
                            { showMainCatSelect: false, showNewMainCatInput: true },
                            { showMainCatSelect: false, showSubcatSelect: false, showNewSubcatInput: true });

                        break;
                    case "onlySubcategory":
                        await showCategoryArticleAsync(
                            null,
                            { showMainCatSelect: true, showSubcatSelect: false, showNewSubcatInput: true });

                        break;
                }

                break;
            case "update":
                switch (selectedModeMenu) {
                    case "mainCategory":
                        await showCategoryArticleAsync(
                            { showMainCatSelect: true, showNewMainCatInput: true },
                            null);

                        break;
                    case "subcategory":
                        await showCategoryArticleAsync(
                            null,
                            { showMainCatSelect: true, showSubcatSelect: true, showNewSubcatInput: true });

                        break;
                }

                break;
            case "delete":
                switch (selectedModeMenu) {
                    case "mainCategory":
                        await showCategoryArticleAsync(
                            { showMainCatSelect: true, showNewMainCatInput: false },
                            null);

                        break;
                    case "subcategory":
                        await showCategoryArticleAsync(
                            null,
                            { showMainCatSelect: true, showSubcatSelect: true, showNewSubcatInput: false });

                        break;
                }

                break;
        }
        //#endregion
    })
    slct.categoryLanguage.change(async () => {
        categoryLanguage = slct.categoryLanguage.val();  // update

        //#region main category control
        // show select <button> when any selected main category of selected category language is not exists 
        if (getSelectedCategoryCount(categoryType.mainCat, categoryLanguage) == 0)
            btn.selectOnMainCat.removeAttr("disabled");

        // disable select <button> (otherwise)
        else
            btn.selectOnMainCat.attr("disabled", "");
        //#endregion

        //#region populate main and subcategories
        if (mode != "add")
            await populateMainAndSubcatsSelectAsync(
                categoryInfos,
                slct.mainCatOnMainCatArticle.val());
        //#endregion
    })
    slct.mainCatOnMainCatArticle.change(async () => {
        //#region populate subcategory <select> by selected main category
        if (mode != "add") {
            //#region set variables
            let baseMainCatNameOfSelectedMainCat = slct.mainCatOnMainCatArticle.val();
            let mainAndSubcatsBySelectedLang = await getMainAndSubcatsByLangFromCategoryInfosAsync(
                baseMainCatNameOfSelectedMainCat,
                categoryLanguage);
            //#endregion

            await populateSelectAsync(
                slct.subcategory,
                mainAndSubcatsBySelectedLang.subcategoryNames,
                null,
                true);
        }
        //#endregion
    })
    btn.send.click(async () => {
        //#region set variables
        p_resultLabel.empty();
        const baseMainCatOfSelectedMainCat = slct.mainCatOnMainCatArticle.val();
        const selectedMainCatInTRCount = getSelectedCategoryCount(categoryType.mainCat, "TR");
        const selectedMainCatInENCount = getSelectedCategoryCount(categoryType.mainCat, "EN");
        const selectedSubcatInTRCount = getSelectedCategoryCount(categoryType.subcat, "TR");
        const selectedSubcatInENCount = getSelectedCategoryCount(categoryType.subcat, "EN");
        //#endregion

        switch (mode) {
            case "add":
                //#region security control

                //#region check selected main categories whether is entered for all languages
                if (selectedMainCatInTRCount == 0
                    || selectedMainCatInTRCount != selectedMainCatInENCount
                ) {
                    // write error message
                    updateResultLabel(
                        "#" + p_resultLabel_id,
                        langPack.errorMessages.badRequestForMainCat[language],
                        resultLabel_errorColor,
                        "30px",
                        img.loading);

                    return;
                }
                //#endregion

                //#region check selected subcategories whether is entered for all languages
                if (selectedSubcatInTRCount == 0
                    || selectedSubcatInTRCount != selectedSubcatInENCount
                ) {
                    // write error message
                    updateResultLabel(
                        "#" + p_resultLabel_id,
                        langPack.errorMessages.badRequestForSubcat[language],
                        resultLabel_errorColor,
                        "30px",
                        img.loading);

                    return;
                }
                //#endregion

                //#endregion

                //#region set data

                //#region set "mainCategoryInEn" and "mainCategoryInTR" data
                let mainCategoryInEn;
                let mainCategoryInTR;

                for (let divId in selectedCatsByLangs.mainCategory.EN) {
                    mainCategoryInEn = selectedCatsByLangs.mainCategory.EN[divId];
                }
                for (let divId in selectedCatsByLangs.mainCategory.TR) {
                    mainCategoryInTR = selectedCatsByLangs.mainCategory.TR[divId];
                }
                //#endregion

                //#region set "subcategoriesInEN" and "subcategoriesInTR"
                let subcategoriesInEN = [];
                let subcategoriesInTR = [];

                for (let divId in selectedCatsByLangs.subcategory.EN) {
                    subcategoriesInEN.push(
                        selectedCatsByLangs.subcategory.EN[divId]);
                }
                for (let divId in selectedCatsByLangs.subcategory.TR) {
                    subcategoriesInTR.push(
                        selectedCatsByLangs.subcategory.TR[divId]);
                }
                //#endregion

                //#endregion

                $.ajax({
                    method: "POST",
                    url: baseApiUrl + `/machineCategory/mainAndSubcategory/add?language=${language}`,
                    headers: {
                        authorization: jwtToken
                    },
                    data: JSON.stringify({
                        mainCategoryInEN: mainCategoryInEn,
                        mainCategoryInTR: mainCategoryInTR,
                        subcategoriesInEN: subcategoriesInEN,
                        subcategoriesInTR: subcategoriesInTR,
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    beforeSend: () => {
                        img.loading.removeAttr("hidden");
                    },
                    success: () => {
                        // write success message
                        updateResultLabel(
                            "#" + p_resultLabel_id,
                            langPack.successMessages.saveSuccessful[language],
                            resultLabel_successColor,
                            "30px",
                            img.loading);

                        // remove old main and subcategories from local
                        localStorage.removeItem(localKeys_allMainAndSubcategories);
                        resetCategoryArticles();
                    },
                    error: (response) => {
                        // write error message
                        updateResultLabel(
                            "#" + p_resultLabel_id,
                            JSON.parse(response.responseText).errorMessage,
                            resultLabel_errorColor,
                            "30px",
                            img.loading);
                    }
                });

                break;
            case "update":
                //#region security control
                // when any main or subcategory is not changed (THROW)
                if (!isAnyMainCategorySelected()
                    && !isAnySubcategorySelected()
                ) {
                    // write error message
                    updateResultLabel(
                        "#" + p_resultLabel_id,
                        langPack.errorMessages.notAnyChanges[language],
                        resultLabel_errorColor,
                        "30px");

                    return
                };
                //#endregion

                //#region set data

                //#region set "oldSubCategoriesInTR" and "newSubCategoriesInTR"
                let oldSubCategoriesInTR = null
                let newSubCategoriesInTR = null;

                if (selectedSubcatInTRCount > 0) {
                    oldSubCategoriesInTR = (await getMainAndSubcatsByLangFromCategoryInfosAsync(
                        baseMainCatOfSelectedMainCat,
                        "TR")
                        .subcategoryNames);
                    newSubCategoriesInTR = [];

                    //#region populate "newSubCategoriesInTR"
                    for (let oldSubcat in selectedCatsByLangs.subcategory.TR)
                        newSubCategoriesInTR.push({
                            oldValue: oldSubcat,
                            newValue: selectedCatsByLangs.subcategory.TR[oldSubcat]
                        });
                    //#endregion
                }
                //#endregion

                //#region set "oldSubCategoriesInEN" and "newSubCategoriesInEN"
                let oldSubCategoriesInEN = (await getMainAndSubcatsByLangFromCategoryInfosAsync(
                    baseMainCatOfSelectedMainCat,
                    "EN")
                    .subcategoryNames);
                let newSubCategoriesInEN = null;

                if (selectedSubcatInENCount > 0) {
                    newSubCategoriesInEN = []

                    //#region populate "newSubCategoriesInEN"
                    for (let oldSubcat in selectedCatsByLangs.subcategory.EN)
                        newSubCategoriesInEN.push({
                            oldValue: oldSubcat,
                            newValue: selectedCatsByLangs.subcategory.EN[oldSubcat]
                        });
                    //#endregion
                }
                //#endregion

                //#endregion

                $.ajax({
                    method: "POST",
                    url: baseApiUrl + `/mainAndSubcategory/update?language=${language}`,
                    data: {
                        OldMainCategoryInEN: baseMainCatOfSelectedMainCat,
                        OldSubCategoriesInEN: oldSubCategoriesInEN,
                        NewMainCategoryInEN: (selectedMainCatInENCount > 0 ?
                            getValuesOfObject(selectedCatsByLangs.mainCategory.EN)[0]
                            : null),
                        NewMainCategoryInTR: (selectedMainCatInTRCount > 0 ?
                            getValuesOfObject(selectedCatsByLangs.mainCategory.TR)[0]
                            : null),
                        NewSubCategoriesInEN: newSubCategoriesInEN,
                        NewSubCategoriesInTR: newSubCategoriesInTR,
                    },
                    contentType: "application/json",
                    dataType: "json",
                    beforeSend: () => {
                        img.loading.removeAttr("hidden");
                    },
                    success: () => {
                        // remove old main and subcats from local
                        localStorage.removeItem(localKeys_allMainAndSubcategories);

                        // write success message
                        updateResultLabel(
                            "#" + p_resultLabel_id,
                            langPack.successMessages.updateSuccessful,
                            resultLabel_successColor,
                            "30px",
                            img.loading);

                        // reload page after 1.5s
                        setTimeout(
                            () => window.location.reload(),
                            1500);
                    },
                    error: (response) => {
                        // write error message
                        updateResultLabel(
                            "#" + p_resultLabel_id,
                            JSON.parse(response.responseText).errorMessage,
                            resultLabel_errorColor,
                            "30px",
                            img.loading);
                    }
                })

                break;
            case "delete":
                break;
        }
    })
    btn.selectOnMainCat.click(async () => {
        //#region before start
        const baseMainCatOfSelectedMainCat = slct.mainCatOnMainCatArticle.val();
        p_resultLabel.empty();

        // hide select <button>
        btn.selectOnMainCat.attr("disabled", "");

        // hide main category <select>
        if (mode != "add")
            slct.mainCatOnMainCatArticle.attr("disabled", "");
        //#endregion

        //#region security control
        // when main category belong to same language is selected again
        if (getSelectedCategoryCount("mainCategory", categoryLanguage) > 0)
            return;

        // when any main category is not added previously
        if (baseMainCatOfSelectedMainCats == null)
            baseMainCatOfSelectedMainCats = baseMainCatOfSelectedMainCat;

        // when different main category is selected
        else if (baseMainCatOfSelectedMainCat != baseMainCatOfSelectedMainCats)
            return;
        //#endregion

        await selectCategoryAsync(categoryType.mainCat);
    })
    btn.selectOnSubCat.click(async () => {
        p_resultLabel.empty();
        await selectCategoryAsync(categoryType.subcat);
    })
    div.selectedMainCategory.on("click", ".btn_cancel", async (event) => {
        p_resultLabel.empty();
        await removeSelectedInputAsync(categoryType.mainCat, $(event.target));
    })
    div.selectedSubcategory.on("click", ".btn_cancel", async (event) => {
        p_resultLabel.empty();
        await removeSelectedInputAsync(categoryType.subcat, $(event.target));
    })
    inpt.newMainCategory.keyup((event) => {
        // when click to "Enter" key
        if (event.key == "enter")
            btn.selectOnMainCat.trigger("click");
    })
    inpt.newMainCategory.keyup((event) => {
        // when click to "Enter" key
        if (event.key == "Enter")
            btn.selectOnMainCat.trigger("click");
    })
    inpt.newSubcategory.keyup((event) => {
        // when click to "Enter" key
        if (event.key == "Enter")
            btn.selectOnSubCat.trigger("click");
    })
    $(".panel-body input").click(() => {
        p_resultLabel.empty();
    })
    $(".panel-body select").click(() => {
        p_resultLabel.empty();
    })
    //#endregion

    //#region functions
    async function setupPageAsync() {
        //#region add panel title
        $(".panel-heading").append(
            langPack.panelTitle[language]);
        //#endregion

        //#region populate <select>s on menubar

        //#region modes <select>
        for (let mode in langPack.modes) {
            let modeNameByLanguage = langPack.modes[mode][language];

            slct.modes.append(
                `<option value="${mode}">${modeNameByLanguage}</option>`);
        }
        //#endregion

        populateModeMenusSelect();

        //#region category language <select>
        var allLanguages = await getDataByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            false);

        await populateSelectAsync(
            slct.categoryLanguage,
            allLanguages,
            language);
        //#endregion

        //#endregion

        //#region populate main and subcategory articles

        //#region main category article

        // add title
        h.mainCategoryTitle.append(
            langPack.article.mainCategoryTitleByMode[mode][language]);

        // add label name
        $("label[for= 'slct_mainCategory']").append(
            langPack.article.mainCategoryLabel.select[language]);
        $("label[for= 'inpt_newMainCategory']").append(
            langPack.article.mainCategoryLabel.input[language]);
        //#endregion

        //#region subcategory article
        // add title
        h.subcategoryTitle.append(
            langPack.article.subcategoryTitleByMode[mode][language]);

        // add label name
        $("label[for= 'slct_subcategory']").append(
            langPack.article.subcategoryLabel.select[language]);  // select 
        $("label[for= 'inpt_newSubcategory']").append(
            langPack.article.subcategoryLabel.input[language]);  // input
        //#endregion

        //#endregion

        //#region add name to buttons
        // select <button>
        btn.selectOnMainCat.append(langPack.article.selectButton[language]);
        btn.selectOnSubCat.append(langPack.article.selectButton[language]);

        // send <button>
        btn.send.append(langPack.sendButton[language]);
        //#endregion
    }
    async function initializeMainAndSubcategoriesSelectAsync() {
        // get all main and subcategories
        categoryInfos = await getDataByAjaxOrLocalAsync(
            localKeys_allMainAndSubcategories,
            "/machineCategory/mainAndSubcategory/display/all",
            false,
            true);

        //#region populate main and subcategory <select>s
        await populateMainAndSubcatsSelectAsync(categoryInfos);

        isCategoriesPopulatedToSelects = true;
        //#endregion
    }
    async function populateMainAndSubcatsSelectAsync(
        categoryInfos,
        baseMainCatToBeDisplay = null  // it must be base main category
    ) {
        // reset main category
        slct.mainCatOnMainCatArticle.empty();

        //#region populate main category <select>
        let subCatsOfDisplayedMainCat = null;
        for (let index in categoryInfos) {
            //#region set variables
            let categoryInfo = categoryInfos[index];
            let mainAndSubCatsByLang = categoryInfo.mainAndSubcatsByLangs.find(m =>
                m.language == categoryLanguage);
            //#endregion

            // populate <select>
            slct.mainCatOnMainCatArticle.append(
                `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubCatsByLang.mainCategoryName}</option>`);

            //#region save subcategories
            // save subcategories of main category that desired display
            if (baseMainCatToBeDisplay != null
                && categoryInfo.baseMainCategoryName == baseMainCatToBeDisplay) {
                subCatsOfDisplayedMainCat = mainAndSubCatsByLang.subcategoryNames;

            }

            // save subcategories of first added main category
            else if (subCatsOfDisplayedMainCat == null) {
                subCatsOfDisplayedMainCat = mainAndSubCatsByLang.subcategoryNames;
            }
            //#endregion
        }

        // display desired main category
        if (baseMainCatToBeDisplay != null) {
            slct.mainCatOnMainCatArticle.val(baseMainCatToBeDisplay);
        }
        //#endregion

        // populate subcategory <select> by displaying main category
        await populateSelectAsync(
            slct.subcategory,
            subCatsOfDisplayedMainCat,
            null,
            true);
    }
    async function selectCategoryAsync(whichCategory) {
        //#region set variables
        const slct_category = (whichCategory == categoryType.mainCat ?
            slct.mainCatOnMainCatArticle
            : slct.subcategory);
        const inpt_newCategory = (whichCategory == categoryType.mainCat ?
            inpt.newMainCategory
            : inpt.newSubcategory);
        const div_selectedCategories = (whichCategory == categoryType.mainCat ?
            div.selectedMainCategory
            : div.selectedSubcategory);
        const newCategory = inpt_newCategory.val();
        const categoryOnSelect = (slct_category
            .children("option:selected")
            .text());
        //#endregion

        //#region security control
        // when mode is "add" or "update" and any value is not entered
        if (mode != "delete"
            && newCategory.length == 0)
            return;
        //#endregion

        //#region add new <input> to selected main/sub categories
        const div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(whichCategory);
        const inpt_newAdded = div_selectedCategories.find("#" + div_formGroup_id + " input");
        //#endregion

        //#region populate new <input> by mode
        switch (mode) {
            case "add":
                // populate new added <input>  
                inpt_newAdded.val(newCategory);

                // reset new main/sub category <input>
                inpt_newCategory.val("");

                // update "selectedCatsByLangs"
                selectedCatsByLangs[whichCategory][categoryLanguage][div_formGroup_id] = newCategory;

                break;
            case "update":
                // save old category to "value" attribute of <div> 
                $("#" + div_formGroup_id).attr("value", categoryOnSelect);

                // populate new added <input>
                inpt_newAdded.val(categoryOnSelect + "  ~>  " + newCategory);

                // reset new main/sub category <input>
                inpt_newCategory.val("");

                // update "selectedCatsByLangs"
                selectedCatsByLangs[whichCategory][categoryLanguage][categoryOnSelect] = newCategory;  // KEY: old category, VALUE: new category

                break;
            case "delete":
                //// populate new added <input>
                //inpt_newAdded.val(categoryLanguage);

                break;
        }
        //#endregion
    }
    async function addNewInputToSelectedInputsAreaAsync(whichCategory) {
        //#region set "div_selectedCatsByLang"
        let div_selectedCats = (whichCategory == categoryType.mainCat ?
            div.selectedMainCategory
            : div.selectedSubcategory);
        let div_selectedCatsOfLang_id = div_selectedCats.attr("class") + "_" + categoryLanguage;  // EX: "div_selectedCategories" + "_" + "EN" => "div_selectedCategories_EN"

        //#region when any main/sub category belong to selected category language is not selected
        if (getSelectedCategoryCount(whichCategory, categoryLanguage) == 0) {
            // add article belong to selected language
            div_selectedCats.append(`
                <div id="${div_selectedCatsOfLang_id}" class="div_selectedCategoriesByLang">
                    <h4>${categoryLanguage}</h4>
                </div>`);
        }
        //#endregion

        let div_selectedCatsOfLang = div_selectedCats.children("#" + div_selectedCatsOfLang_id);
        //#endregion

        //#region set "nextDivNo"
        let nextDivNo = nextDivNos[whichCategory];
        nextDivNos[whichCategory] += 1;
        //#endregion

        //#region add new input to selected main/subcategory inputs area
        let div_newAddedInput_id = "div_" + nextDivNo;

        div_selectedCatsOfLang.append(
            `<div id="${div_newAddedInput_id}" class="form-group" style="margin-bottom: 0px">
                <label class="col-sm-3 control-label"></label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" readonly/>
                </div>
                <div class="col-sm-3">
                    <button type="button" class="btn btn_cancel">
                        <img src="/images/cancel.png" alt="cancel"/>
                    </button>
                </div>
            </div>`);
        //#endregion

        return div_newAddedInput_id;
    }
    async function removeSelectedInputAsync(whichCategory, clickedElement) {
        //#region remove selected main/subcategory from "selectedCatsByLangs" by mode
        const div_formGroupOfCancelButton = clickedElement.closest("div[class= 'form-group']");
        const titleOfSelectedCategory = (div_formGroupOfCancelButton
            .siblings("h4")
            .text());  // category language

        switch (mode) {
            case "add": delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][div_formGroupOfCancelButton.attr("id")]; break;
            case "update": delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][div_formGroupOfCancelButton.attr("value")]; break;
            case "delete": break;
        }
        //#endregion

        //#region remove selected main/subcategory <input>
        // when any main/sub category of selected language is not exists (remove article of selected language)
        if (getSelectedCategoryCount(whichCategory, titleOfSelectedCategory) == 0)
            div_formGroupOfCancelButton
                .parent()
                .remove();

        // when any main/sub category is exists (remove only selected main/sub category)
        else
            div_formGroupOfCancelButton.remove();
        //#endregion

        //#region show <select> or select <button> of main category
        if (whichCategory == categoryType.mainCat) {
            // when any selected main category by language is not exists
            if (getSelectedCategoryCount(whichCategory, categoryLanguage) == 0)
                btn.selectOnMainCat.removeAttr("disabled");

            // when any selected main category is not exists
            if (mode != "add"
                && !isAnyMainCategorySelected())
                slct.mainCatOnMainCatArticle.removeAttr("disabled");
        }
        //#endregion
    }
    async function getMainAndSubcatsByLangFromCategoryInfosAsync(baseMainCatName, language) {
        let categoryInfoOfBaseMainCat = categoryInfos.find(c =>
            c.baseMainCategoryName == baseMainCatName);

        return categoryInfoOfBaseMainCat.mainAndSubcatsByLangs.find(m =>
            m.language == language);
    }
    async function showCategoryArticleAsync(
        mainCategoryArticle = { showMainCatSelect: false, showNewMainCatInput: false } || null,
        subcategoryArticle = { showMainCatSelect: false, showSubcatSelect:false, showNewSubcatInput: false } || null
    ) { 
        //#region show/hide main category article

        //#region when main category is desired to be displayed
        let _;

        if (mainCategoryArticle != null) {
            // show main category article
            div.mainCategoryArticle.removeAttr("hidden", "");

            // show/hide main category <select> in main category article
            _ = (mainCategoryArticle.showMainCatSelect ?
                div.mainCatSelectOnMainCatArticle.removeAttr("hidden")  // show
                : div.mainCatSelectOnMainCatArticle.attr("hidden", ""));

            // show/hide new maincategory <input>
            _ = (mainCategoryArticle.showNewMainCatInput ?
                div.newMainCategoryInput.removeAttr("hidden")  // show
                : div.newMainCategoryInput.attr("hidden", ""));
        }
        //#endregion

        //#region when main category is not desired to be displayed
        else
            div.mainCategoryArticle.attr("hidden", "");
        //#endregion

        //#endregion

        //#region show/hide subcategory article

        //#region when subcategory is desired to be displayed
        if (subcategoryArticle != null) {
            // show subcategory article
            div.subcategoryArticle.removeAttr("hidden", "");

            // show/hide main category <select> in subcategory article
            _ = (subcategoryArticle.showMainCatSelect ?
                div.mainCatSelectOnSubcatArticle.removeAttr("hidden")  // show
                : div.mainCatSelectOnSubcatArticle.attr("hidden", ""));

            // show/hide subcategory <select>
            _ = subcategoryArticle.showSubcatSelect ?
                div.subcategorySelect.removeAttr("hidden")
                : div.subcategorySelect.attr("hidden", "")

            // show/hide new subcategory <input>
            _ = (subcategoryArticle.showNewSubcatInput ?
                div.newSubcategoryInput.removeAttr("hidden")  // show
                : div.newSubcategoryInput.attr("hidden", ""));
        }
        //#endregion

        //#region when subcategory is not desired to be displayed
        else
            div.subcategoryArticle.attr("hidden", "");
        //#endregion

        //#endregion
    }
    function populateModeMenusSelect() {
        // reset mode menus <select>
        slct.modeMenus.empty();

        // populate mode menus <select> by mode
        for (let catType in langPack.categoryTypesByMode[mode]) {
            let catTypeByLang = langPack.categoryTypesByMode[mode][catType][language];

            slct.modeMenus.append(
                `<option value="${catType}">${catTypeByLang}</option>`);
        }
    }
    function getSelectedCategoryCount(whichCategory, categoryLanguage) {
        return Object
            .keys(selectedCatsByLangs[whichCategory][categoryLanguage])
            .length;
    }
    function resetCategoryArticles() {
        //#region reset <select> and <input> of subcategory article
        slct.subcategory.prop("selectedIndex", 0);
        inpt.newSubcategory.val("");
        //#endregion

        //#region reset selected main and subcategory
        div.selectedCategories.empty();

        // reset "selectedCatsByLangs"
        for (let categoryType in { mainCategory: "", subcategory: "" })
            for (let language in selectedCatsByLangs[categoryType]) selectedCatsByLangs[categoryType][language] = {};
        //#endregion

        //#region show select <button>s
        btn.selectOnMainCat.removeAttr("disabled");
        btn.selectOnSubCat.removeAttr("disabled");
        //#endregion
    }
    function resetMainCategoryArticle() {
        // reset variables
        baseMainCatOfSelectedMainCats = null;

        // reset new main category <input>
        inpt.newMainCategory.val("");

        // show main category <select> and reset it
        slct.mainCatOnMainCatArticle.removeAttr("disabled");
        slct.mainCatOnMainCatArticle.prop("selectedIndex", 0);

        // remove selected main category <input>
        div.selectedMainCategory.empty();

        // reset maincategories in "selectedCatsByLangs"
        for (let language in selectedCatsByLangs.mainCategory)
            selectedCatsByLangs.mainCategory[language] = {};

        //#region show select <button>
        btn.selectOnMainCat.removeAttr("disabled");
    }
    function resetSubcategoryArticle() {
        // show subcategory <select> and reset it
        slct.subcategory.removeAttr("disabled");
        slct.subcategory.prop("selectedIndex", 0);

        // reset selected subcategory
        div.selectedCategories.empty();

        // reset subcategories in "selectedCatsByLangs"
        for (let language in selectedCatsByLangs.subcategory)
            selectedCatsByLangs.subcategory[language] = {};

        //#region show select <button>s
        btn.selectOnMainCat.removeAttr("disabled");
        btn.selectOnSubCat.removeAttr("disabled");
        //#endregion
    }
    function isAnyMainCategorySelected() {
        // control selected main categories in all languages
        for (let catLanguage in selectedCatsByLangs.mainCategory)
            if (getSelectedCategoryCount(categoryType.mainCat, catLanguage) > 0)
                return true;

        return false;
    }
    function isAnySubcategorySelected() {
        // control selected subcategories in all languages
        for (let catLanguage in selectedCatsByLangs.subcategory)
            if (getSelectedCategoryCount(categoryType.subcat, catLanguage) > 0)
                return true;

        return false;
    }
    //#endregion

    setupPageAsync();
});