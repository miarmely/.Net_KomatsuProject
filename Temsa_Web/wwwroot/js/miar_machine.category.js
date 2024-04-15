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
        mainCategory: $(".slct_mainCategory"),
        mainCatOnMainCatArticle: $(".div_category:nth-child(1) #slct_mainCategory"),
        mainCatOnSubcatArticle: $(".div_category:nth-child(2) #slct_mainCategory"),
        subcategory: $("#slct_subcategory"),
    };
    const h = {
        mainCategoryTitle: $(".div_category:nth-child(1) .h_articleTitle"),
        subcategoryTitle: $(".div_category:nth-child(2) .h_articleTitle"),
    };
    const div_id = {
        mainCategoryArticle: "div_mainCategoryArticle",
        subcategoryArticle: "div_subcategoryArticle",
    }
    const div = {
        mainCategoryArticle: $("#" + div_id.mainCategoryArticle),
        subcategoryArticle: $("#" + div_id.subcategoryArticle),
        mainCatSelectOnMainCatArticle: $("#" + div_id.mainCategoryArticle + " label[for='slct_mainCategory']").parent(),
        mainCatSelectOnSubcatArticle: $("#" + div_id.subcategoryArticle + " label[for='slct_mainCategory']").parent(),
        newMainCategoryInput: $("label[for='inpt_newMainCategory']").parent(),
        newSubcategoryInput: $("label[for='inpt_newSubcategory']").parent(),
        subcategorySelect: $("label[for='slct_subcategory']").parent(),
        selectedMainCategory: $("#" + div_id.mainCategoryArticle + " .div_selectedCategories"),
        selectedSubcategory: $("#" + div_id.subcategoryArticle + " .div_selectedCategories"),
        selectedCategories: $(".div_selectedCategories")
    };
    const btn = {
        send: $("#div_sendButton button"),
        select: $(".div_categoryButton button"),
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
    const p_id = {
        resultLabelForSelectBtnOnMainCat: div_id.mainCategoryArticle + " #p_resultLabelForSelectBtn",
        resultLabelForSelectBtnOnSubcat: div_id.subcategoryArticle + " #p_resultLabelForSelectBtn",
        resultLabelForSendBtn: "p_resultLabelForSendBtn",
    }
    const p = {
        resultLabelForSendBtn: $("#" + p_id.resultLabelForSendBtn),
        resultLabelForSelectBtnOnMainCat: $("#" + p_id.resultLabelForSelectBtnOnMainCat),
        resultLabelForSelectBtnOnSubcat: $("#" + p_id.resultLabelForSelectBtnOnSubcat),
    }
    const categoryType = {
        mainCat: "mainCategory",
        subcat: "subcategory"
    }
    let mode = "add";  // add | update | delete
    let modeMenu = "newCategory";
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
        resetResultLabels
        await changeLangOfCatsInMainOrSubcatSelectByModesAsync();
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
                break;
            case "delete":
                await showCategoryArticleAsync(
                    { showMainCatSelect: true, showNewMainCatInput: false },
                    null);
                break;
        }
    })
    slct.modeMenus.change(async () => {
        //#region resets
        await changeLangOfCatsInMainOrSubcatSelectByModesAsync();

        resetCategoryArticles();
        //#endregion

        //#region set main/subcategory articles by selected mode menu
        modeMenu = slct.modeMenus.val();

        switch (mode) {
            case "add":
                switch (modeMenu) {
                    case "newCategory":
                        await showCategoryArticleAsync(
                            { showMainCatSelect: false, showNewMainCatInput: true },
                            { showMainCatSelect: false, showSubcatSelect: false, showNewSubcatInput: true });

                        break;
                    case "onlySubcategory":
                        await showCategoryArticleAsync(
                            null,
                            { showMainCatSelect: true, showSubcatSelect: true, showNewSubcatInput: true });

                        break;
                }

                break;
            case "update":
                switch (modeMenu) {
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
                switch (modeMenu) {
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

        await changeLangOfCatsInMainOrSubcatSelectByModesAsync();
    })
    slct.mainCategory.change(async () => {
        //#region populate subcategories <select> on subcategory article by mode
        let modeMenu = slct.modeMenus.val();

        if ((mode == "add" && modeMenu == "onlySubcategory")
            || (mode == "update" && modeMenu == categoryType.subcat)
            || (mode == "delete" && modeMenu == categoryType.subcat)
        ) {
            //#region populate subcategories <select>
            let baseMainCat = slct.mainCatOnSubcatArticle.val();
            let mainAndSubCatsByLang = await getMainAndSubcatsByLangFromCategoryInfosAsync(baseMainCat, categoryLanguage);

            populateSelectAsync(
                slct.subcategory,
                mainAndSubCatsByLang.subcategoryNames,
                null,
                true);
            //#endregion
        }
        //#endregion
    })
    btn.select.click(async (event) => {
        resetResultLabels();

        //#region set variables
        const newMainCategory = inpt.newMainCategory.val();
        const newSubcategory = inpt.newSubcategory.val();
        const selectedMainCatOnMainCatArticle = slct.mainCatOnMainCatArticle.val();
        const selectedMainCatOnSubCatArticle = slct.mainCatOnSubcatArticle.val();
        const selectedSubcategory = slct.subcategory.val();
        const modeMenu = slct.modeMenus.val();
        let isErrorOccured = false;
        let div_formGroup_id;
        let inpt_newAdded;
        //#endregion

        switch (mode) {
            case "add":
                switch (modeMenu) {
                    case "newCategory":
                        //#region set variables
                        const catTypeOfClickedSelectBtn = getCategoryTypeOfSelectButton($(event.target));
                        const div_selectedCategories = (catTypeOfClickedSelectBtn == categoryType.mainCat ?
                            div.selectedMainCategory
                            : div.selectedSubcategory);
                        const inpt_newCategory = (catTypeOfClickedSelectBtn == categoryType.mainCat ?
                            inpt.newMainCategory
                            : inpt.newSubcategory);
                        const newCategory = inpt_newCategory.val();
                        const btn_select = (catTypeOfClickedSelectBtn == categoryType.mainCat ?
                            btn.selectOnMainCat
                            : btn.selectOnSubCat);
                        //#endregion

                        //#region security control (PARTNER)
                        // when new main/subcategory <input> is empty
                        if (newCategory.length == 0)
                            isErrorOccured = true;
                        //#endregion

                        //#region security control
                        switch (catTypeOfClickedSelectBtn) {
                            case categoryType.mainCat:
                                // when main category by selected language is selected again
                                if (getSelectedCategoryCount(categoryType.mainCat, categoryLanguage) > 0)
                                    isErrorOccured = true;

                                // write error message if security is failed
                                if (isErrorOccured) {
                                    updateResultLabel(
                                        "#" + p_id.resultLabelForSelectBtnOnMainCat,
                                        langPack.errorMessages.invalidProcess[language],
                                        resultLabel_errorColor);
                                    return;
                                }

                                break;
                            case categoryType.subcat:
                                // write error message if security is failed
                                if (isErrorOccured) {
                                    updateResultLabel(
                                        "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                        langPack.errorMessages.invalidProcess[language],
                                        resultLabel_errorColor);
                                    return;
                                }

                                break;
                        }
                        //#endregion

                        //#region add new <input> to selected main/subcategories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(catTypeOfClickedSelectBtn);
                        inpt_newAdded = div_selectedCategories.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // populate <input>
                        inpt_newAdded.val(newCategory);

                        // reset new main/subcategory <input>
                        inpt_newCategory.val("");

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs[catTypeOfClickedSelectBtn][categoryLanguage][div_formGroup_id] = newCategory;
                        //#endregion

                        //#region after populate
                        switch (catTypeOfClickedSelectBtn) {
                            case categoryType.mainCat:
                                // disable select <button> on main/subcategory article
                                btn_select.attr("disabled", "");

                                break;
                        }
                        //#endregion

                        break;
                    case "onlySubcategory":
                        //#region security control
                        // when new main/subcategory <input> is empty
                        if (newSubcategory.length == 0)
                            isErrorOccured = true;

                        // write error message if security is failed
                        if (isErrorOccured) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);
                            return;
                        }
                        //#endregion

                        //#region add new <input> to selected main/subcategories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(categoryType.subcat);
                        inpt_newAdded = div.selectedSubcategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // populate <input>
                        inpt_newAdded.val(newSubcategory);

                        // reset new subcategory <input>
                        inpt.newSubcategory.val("");

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs[categoryType.subcat][categoryLanguage][div_formGroup_id] = newSubcategory;

                        // disable main category <select> on subcategory article
                        slct.mainCatOnSubcatArticle.attr("disabled", "");
                        //#endregion

                        break;
                }
                break;
            case "update":
                switch (modeMenu) {
                    case categoryType.mainCat:
                        //#region add new <input> to selected main/sub categories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(categoryType.mainCat);
                        inpt_newAdded = div.selectedMainCategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // save old main category to "value" attribute of <div> 
                        $("#" + div_formGroup_id).attr("value", selectedMainCatOnMainCatArticle);

                        // populate new added <input>
                        inpt_newAdded.val(selectedMainCatOnMainCatArticle + "  ~>  " + newMainCategory);

                        // reset new main/sub category <input>
                        inpt.newMainCategory.val("");

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs[categoryType.mainCat][categoryLanguage][selectedMainCatOnMainCatArticle] = newMainCategory;  // KEY: old category, VALUE: new category

                        // hide select <button>
                        btn.selectOnMainCat.attr("disabled", "");

                        // disabled main categeries <select>
                        slct.mainCatOnMainCatArticle.attr("disabled", "");
                        //#endregion

                        break;
                    case categoryType.subcat:
                        break;
                }
                break;
            case "delete":
                switch (modeMenu) {
                    case "mainCategory":
                        break;
                    case "subcategory":
                        break;
                }
                break;
        }
    })
    btn.send.click(async () => {
        resetResultLabels();

        //#region set variables
        const baseMainCatOfSelectedMainCat = slct.mainCatOnMainCatArticle.val();
        const selectedMainCatInTRCount = getSelectedCategoryCount(categoryType.mainCat, "TR");
        const selectedMainCatInENCount = getSelectedCategoryCount(categoryType.mainCat, "EN");
        const selectedSubcatInTRCount = getSelectedCategoryCount(categoryType.subcat, "TR");
        const selectedSubcatInENCount = getSelectedCategoryCount(categoryType.subcat, "EN");
        const modeMenu = slct.modeMenus.val();
        //#endregion

        switch (mode) {
            case "add":
                //#region security control (PARTNER)

                //#region check selected subcategories whether is entered for all languages
                if (selectedSubcatInTRCount == 0
                    || selectedSubcatInTRCount != selectedSubcatInENCount
                ) {
                    // write error message
                    updateResultLabel(
                        "#" + p_id.resultLabelForSendBtn,
                        langPack.errorMessages.badRequestForSubcat[language],
                        resultLabel_errorColor,
                        "30px",
                        img.loading);

                    return;
                }
                //#endregion

                //#endregion

                //#region add main/subcategories by mode menu
                let mainCategoryInEN;
                let mainCategoryInTR;
                let subcategoriesInEN = [];
                let subcategoriesInTR = [];

                switch (modeMenu) {
                    case "newCategory":
                        //#region security control

                        //#region check selected main categories whether is entered for all languages
                        if (selectedMainCatInTRCount == 0
                            || selectedMainCatInTRCount != selectedMainCatInENCount
                        ) {
                            // write error message
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                langPack.errorMessages.badRequestForMainCat[language],
                                resultLabel_errorColor,
                                "30px",
                                img.loading);

                            return;
                        }
                        //#endregion

                        //#endregion

                        //#region set data

                        //#region set "mainCategoryInEN" and "mainCategoryInTR"
                        for (let divId in selectedCatsByLangs.mainCategory.EN) {
                            mainCategoryInEN = selectedCatsByLangs.mainCategory.EN[divId];
                        }
                        for (let divId in selectedCatsByLangs.mainCategory.TR) {
                            mainCategoryInTR = selectedCatsByLangs.mainCategory.TR[divId];
                        }
                        //#endregion

                        //#region set "subcategoriesInEN" and "subcategoriesInTR"
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
                                mainCategoryInEN: mainCategoryInEN,
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
                                    "#" + p_id.resultLabelForSendBtn,
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
                                    "#" + p_id.resultLabelForSendBtn,
                                    JSON.parse(response.responseText).errorMessage,
                                    resultLabel_errorColor,
                                    "30px",
                                    img.loading);
                            }
                        });

                        break;
                    case "onlySubcategory":
                        //#region set data

                        //#region set "subcategoriesInEN" and "subcategoriesInTR"
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
                        let x = slct.mainCatOnSubcatArticle.val();

                        $.ajax({
                            method: "POST",
                            url: baseApiUrl + `/machineCategory/subcategory/add?language=${language}`,
                            headers: {
                                authorization: jwtToken
                            },
                            data: JSON.stringify({
                                mainCategoryInEN: slct.mainCatOnSubcatArticle.val(),
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
                                    "#" + p_id.resultLabelForSendBtn,
                                    langPack.successMessages.saveSuccessful[language],
                                    resultLabel_successColor,
                                    "30px",
                                    img.loading);

                                // remove all old main and subcategories from local
                                localStorage.removeItem(localKeys_allMainAndSubcategories);

                                // show main category <select>
                                slct.mainCatOnSubcatArticle.removeAttr("disabled");

                                resetCategoryArticles();
                            },
                            error: (response) => {
                                // write error message
                                updateResultLabel(
                                    "#" + p_id.resultLabelForSendBtn,
                                    JSON.parse(response.responseText).errorMessage,
                                    resultLabel_errorColor,
                                    "30px",
                                    img.loading);
                            }
                        });

                        break;
                }
                //#endregion

                break;
            case "update":
                //#region security control
                // when any main or subcategory is not changed (THROW)
                if (!isAnyMainCategorySelected()
                    && !isAnySubcategorySelected()
                ) {
                    // write error message
                    updateResultLabel(
                        "#" + p_id.resultLabelForSendBtn,
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
                            "#" + p_id.resultLabelForSendBtn,
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
                            "#" + p_id.resultLabelForSendBtn,
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
    div.selectedMainCategory.on("click", ".btn_cancel", async (event) => {
        resetResultLabels();
        await removeSelectedInputAsync(categoryType.mainCat, $(event.target));
    })
    div.selectedSubcategory.on("click", ".btn_cancel", async (event) => {
        resetResultLabels();
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
        resetResultLabels();
    })
    $(".panel-body select").click(() => {
        resetResultLabels();
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

        await initializeMainAndSubcategoriesSelectAsync();
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

        //#region populate main category <select>'s on main/subcategory article
        let subCatsOfDisplayedMainCat = null;
        for (let index in categoryInfos) {
            //#region set variables
            let categoryInfo = categoryInfos[index];
            let mainAndSubCatsByLang = categoryInfo.mainAndSubcatsByLangs.find(m =>
                m.language == categoryLanguage);
            //#endregion

            //#region populate <select>'s
            slct.mainCatOnMainCatArticle.append(
                `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubCatsByLang.mainCategoryName}</option>`);
            slct.mainCatOnSubcatArticle.append(
                `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubCatsByLang.mainCategoryName}</option>`);
            //#endregion

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
        subcategoryArticle = { showMainCatSelect: false, showSubcatSelect: false, showNewSubcatInput: false } || null
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

            // show/hide main category <select> on subcategory article
            _ = (subcategoryArticle.showMainCatSelect ?
                div.mainCatSelectOnSubcatArticle.removeAttr("hidden")
                && slct.mainCatOnSubcatArticle.removeAttr("disabled") // show
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
    async function changeLangOfCatsInMainOrSubcatSelectAsync(
        catLanguage,
        slct_mainCategory,
        slct_subcategory = null,
    ) {
        //#region populate main categories again by desired language
        // save selected main category before reset
        let baseMainCatOfSelectedMainCat = slct_mainCategory.val();
        slct_mainCategory.empty();

        // populate main categories
        for (let index in categoryInfos) {
            let categoryInfo = categoryInfos[index];
            let mainAndSubcatsByDesiredLang = categoryInfo.mainAndSubcatsByLangs.find(m =>
                m.language == catLanguage);

            slct_mainCategory.append(
                `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubcatsByDesiredLang.mainCategoryName}</option>`)
        }
            
        // add default value
        slct_mainCategory.val(baseMainCatOfSelectedMainCat);
        //#endregion

        //#region populate subcategories by desired language
        if (slct_subcategory != null) {
            slct_subcategory.empty();
            const mainAndSubcatsByLang = await getMainAndSubcatsByLangFromCategoryInfosAsync(baseMainCatOfSelectedMainCat, categoryLanguage);
            
            populateSelectAsync(
                slct_subcategory,
                mainAndSubcatsByLang.subcategoryNames,
                null,
                true);
        }
        //#endregion
    }
    async function changeLangOfCatsInMainOrSubcatSelectByModesAsync(){
        //#region change language of main and subcategory <select>'s by mode
        switch (mode) {
            case "add":
                if (modeMenu == "onlySubcategory")
                    await changeLangOfCatsInMainOrSubcatSelectAsync(
                        categoryLanguage,
                        slct.mainCatOnSubcatArticle,
                        slct.subcategory);
                break;
            case "update":
                switch (modeMenu) {
                    case categoryType.mainCat:
                        await changeLangOfCatsInMainOrSubcatSelectAsync(
                            categoryLanguage,
                            slct.mainCatOnMainCatArticle);
                        break;
                    case categoryType.subcat:
                        await changeLangOfCatsInMainOrSubcatSelectAsync(
                            categoryLanguage,
                            slct.mainCatOnSubcatArticle,
                            slct.subcategory);
                        break;
                }
                break;
            case "delete":
                break;
        }
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

        // save displayed mode menu
        modeMenu = slct.modeMenus.val();
    }
    function getSelectedCategoryCount(whichCategory, categoryLanguage) {
        return Object
            .keys(selectedCatsByLangs[whichCategory][categoryLanguage])
            .length;
    }
    function getCategoryTypeOfSelectButton(btn_select) {
        let div_category_id = (btn_select
            .closest(".div_category")
            .attr("id"));

        return div_category_id == div_id.mainCategoryArticle ?
            categoryType.mainCat
            : categoryType.subcat;
    }
    function resetCategoryArticles() {
        //#region reset <select> and <input> on main/subcategory article
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
    function resetResultLabels() {
        p.resultLabelForSelectBtnOnMainCat.empty();
        p.resultLabelForSelectBtnOnSubcat.empty();
        p.resultLabelForSendBtn.empty();
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