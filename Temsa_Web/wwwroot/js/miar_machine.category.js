import { getValuesOfObject } from "./miar_module.dictionary.js";
import { getMainAndSubcatsOfBaseMainCatByLangAsync } from "./miar_machine.js";
import {
    getDataByAjaxOrLocalAsync, populateSelectAsync, updateElementText, updateResultLabel
} from "./miar_tools.js";


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
        categoryMenubar: "div_category_menubar"
    };
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
        select: $(".div_category .div_categoryButton button"),
        selectOnMainCat: $("form .div_category:nth-child(1) .div_categoryButton button"),
        selectOnSubCat: $("form .div_category:nth-child(2) .div_categoryButton button"),
        newMainCategoryInfoMessageButton: $("#btn_newMainCategoryInfoMessageButton")
    };
    const inpt = {
        newMainCategory: $("#inpt_newMainCategory"),
        newSubcategory: $("#inpt_newSubcategory"),
    };
    const img = {
        loading: $("#img_loading")
    };
    const p_id = {
        resultLabelForSelectBtnOnMainCat: div_id.mainCategoryArticle + " #p_resultLabelForSelectBtn",
        resultLabelForSelectBtnOnSubcat: div_id.subcategoryArticle + " #p_resultLabelForSelectBtn",
        resultLabelForSendBtn: "p_resultLabelForSendBtn",
    };
    const p = {
        resultLabelForSendBtn: $("#" + p_id.resultLabelForSendBtn),
        resultLabelForSelectBtnOnMainCat: $("#" + p_id.resultLabelForSelectBtnOnMainCat),
        resultLabelForSelectBtnOnSubcat: $("#" + p_id.resultLabelForSelectBtnOnSubcat),
    };
    const categoryType = {
        mainCat: "mainCategory",
        subcat: "subcategory"
    };
    const articleType = {
        mainCat: "mainCategory",
        subcat: "subcategory"
    };
    const modeMenus = {
        add: {
            newCat: "newCategory",
            onlySubcat: "onlySubcategory"
        },
        update: {
            mainCat: "mainCategory",
            subcat: "subcategory"
        },
        delete: {
            mainCat: "mainCategory",
            subcat: "subcategory"
        }
    }
    const ul = {
        menubarInfoMessage: $("#" + div_id.categoryMenubar + " .div_infoMessage ul")
    }
    let mode = "add";  // add | update | delete
    let modeMenu = "newCategory";
    let categoryLanguage = language;
    let nextDivNos = {
        mainCategory: 0,
        subcategory: 0
    };  // for id of selected main/subcategory inputs
    let categoryInfos = [];
    let selectedCatsByLangs = {
        mainCategory: {
            TR: {},
            EN: {}
        },
        subcategory: {
            TR: {},
            EN: {}
        },
    };
    let oldSelectedBaseMainCat = "";
    let previousMode = "add";  // for populate main/subcat <select>'s
    //#endregion

    //#region events
    slct.modes.change(async () => {
        //#region resets
        // show category language <select>
        slct.categoryLanguage.css("display", "inline");

        await resetCategoryArticlesAsync();
        resetResultLabels();
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

        //#region show articles by mode
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
                // hide category language <select>
                slct.categoryLanguage.css("display", "none",);

                await populateMainAndSubcatsSelectAsync(language);  // repopulate main/subcat <select>'s by "page language"
                await showCategoryArticleAsync(
                    { showMainCatSelect: true, showNewMainCatInput: false, },
                    null);
                break;
        }
        //#endregion

        //#region when previous mode is delete but current mode is not delete
        if (previousMode == "delete")
            await populateMainAndSubcatsSelectAsync(categoryLanguage);  // repopulate main/subcat <select>'s by "category language"
        //#endregion

        previousMode = mode;  // update
    })
    slct.modeMenus.change(async () => {
        await resetCategoryArticlesAsync();

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
        //#region show/hide select <button> on main category article
        categoryLanguage = slct.categoryLanguage.val();

        if ((mode == "add" && modeMenu == modeMenus.add.newCat)
            || (mode == "update" && modeMenu == modeMenus.update.mainCat)
        ) {
            // hide
            if (isAnyMainCategorySelectedByLanguage(categoryLanguage))
                btn.selectOnMainCat.attr("disabled", "");

            // show
            else
                btn.selectOnMainCat.removeAttr("disabled");
        }
        //#endregion

        //#region populate main/subcategory <select>
        const selectedMainCatOnMainCatArticle = slct.mainCatOnMainCatArticle.val();
        const selectedMainCatOnSubcatArticle = slct.mainCatOnSubcatArticle.val();

        await populateMainAndSubcatsSelectAsync(
            categoryLanguage,
            selectedMainCatOnMainCatArticle,
            selectedMainCatOnSubcatArticle);
        //#endregion
    })
    slct.mainCategory.change(async () => {
        //#region set variables
        const modeMenu = slct.modeMenus.val();
        const baseMainCat = slct.mainCatOnSubcatArticle.val();
        //#endregion

        //#region set "mainAndSubCatsByLang" by mode
        // by category language
        if ((mode == "add" && modeMenu == "onlySubcategory")
            || (mode == "update" && modeMenu == categoryType.subcat)
            || (mode == "delete" && modeMenu == categoryType.subcat)
        ) {
            // get main/subcats by "page language"
            let mainAndSubCatsByLang;
            if (mode == "delete")
                mainAndSubCatsByLang = await getMainAndSubcatsOfBaseMainCatByLangAsync(
                    baseMainCat,
                    language);

            // get main/subcats by "category language"
            else
                mainAndSubCatsByLang = await getMainAndSubcatsOfBaseMainCatByLangAsync(
                    baseMainCat,
                    categoryLanguage);

            // populate subcat <select>
            await populateSelectAsync(
                slct.subcategory,
                mainAndSubCatsByLang.subcategoryNames,
                null,
                true);
        }
        //#endregion
    })
    btn.select.click(async (event) => {
        resetResultLabels();

        //#region set variables
        const newMainCategory = inpt.newMainCategory.val().trim();
        const newSubcategory = inpt.newSubcategory.val().trim();
        const selectedMainCatOnMainCatArticle = slct.mainCatOnMainCatArticle.children("option:selected").text();
        let isErrorOccured = false;
        let div_formGroup_id;
        let inpt_newAdded;
        //#endregion

        switch (mode) {
            case "add":
                switch (modeMenu) {
                    case modeMenus.add.newCat:
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

                        //#region security control (THROW)
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
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            catTypeOfClickedSelectBtn,
                            categoryLanguage);

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
                    case modeMenus.add.onlySubcat:
                        //#region security control (THROW)
                        // when new selected main category is different from previous selected main
                        if (isDifferentMainCategorySelected(articleType.subcat))
                            isErrorOccured = true;

                        // when new subcategory <input> is empty
                        else if (newSubcategory.length == 0)
                            isErrorOccured = true;

                        // when security is failed (THROW)
                        if (isErrorOccured) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);
                            return;
                        }
                        //#endregion

                        //#region add new <input> to selected main/subcategories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            categoryType.subcat,
                            categoryLanguage);

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
                    case modeMenus.update.mainCat:
                        //#region security control (THROW)
                        // when different main category is selected
                        if (isDifferentMainCategorySelected(articleType.mainCat))
                            isErrorOccured = true;

                        // when new main category <input> is empty
                        else if (newMainCategory.length == 0)
                            isErrorOccured = true;

                        // when main category by selected language is selected again
                        else if (getSelectedCategoryCount(categoryType.mainCat, categoryLanguage) > 0)
                            isErrorOccured = true;

                        // when security is failed (THROW)
                        if (isErrorOccured) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnMainCat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);
                            return;
                        }
                        //#endregion

                        //#region add new <input> to selected main/sub categories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            categoryType.mainCat,
                            categoryLanguage);

                        inpt_newAdded = div.selectedMainCategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // save main category of selected main category to "value" attribute of <div>
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
                    case modeMenus.update.subcat:
                        //#region security control (THROW)
                        // when different main category is selected
                        if (isDifferentMainCategorySelected(articleType.subcat))
                            isErrorOccured = true;

                        // when new subcategory <input> is empty
                        else if (newSubcategory.length == 0)
                            isErrorOccured = true;

                        // when same old subcategory is selected (THROW)
                        else {
                            const selectedOldSubcats = Object.keys(selectedCatsByLangs.subcategory[categoryLanguage]);
                            const nowSelectedOldSubcat = slct.subcategory.val();

                            if (selectedOldSubcats.find(o => o == nowSelectedOldSubcat) != null) {
                                updateResultLabel(
                                    "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                    langPack.errorMessages.conflictForSelectSubcategory[language],
                                    resultLabel_errorColor);

                                return;
                            }
                        }

                        // write error message if security is failed
                        if (isErrorOccured) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);
                            return;
                        }
                        //#endregion

                        //#region add new <input> to selected subcategories area
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            categoryType.subcat,
                            categoryLanguage);

                        inpt_newAdded = div.selectedSubcategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // save subcategory of selected main category to "value" attribute of <div>
                        const oldSubcategory = slct.subcategory.val();
                        $("#" + div_formGroup_id).attr("value", oldSubcategory);

                        // populate new added <input>
                        inpt_newAdded.val(oldSubcategory + "  ~>  " + newSubcategory);

                        // reset new main/sub category <input>
                        inpt.newSubcategory.val("");

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs[categoryType.subcat][categoryLanguage][oldSubcategory] = newSubcategory;  // KEY: old category, VALUE: new category

                        // disabled main categeries <select>
                        slct.mainCatOnSubcatArticle.attr("disabled", "");
                        //#endregion

                        break;
                }
                break;
            case "delete":
                switch (modeMenu) {
                    case modeMenus.delete.mainCat:
                        //#region security control (THROW)
                        // when main category by selected language is selected again
                        if (getSelectedCategoryCount(categoryType.mainCat, language) > 0) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnMainCat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);

                            return;
                        }
                        //#endregion

                        //#region add new <input> to selected maincategories area
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            categoryType.mainCat,
                            language);

                        inpt_newAdded = div.selectedMainCategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // populate <input>
                        const selectedMainCategory = slct.mainCatOnMainCatArticle.children("option:selected").text();
                        inpt_newAdded.val(selectedMainCategory);

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs.mainCategory[language][div_formGroup_id] = slct.mainCatOnMainCatArticle.val();

                        // disable select <button> on main category article
                        btn.selectOnMainCat.attr("disabled", "");
                        //#endregion

                        break;
                    case modeMenus.delete.subcat:
                        //#region security control (THROW)

                        //#region when different main category is selected (THROW)
                        if (isDifferentMainCategorySelected(articleType.subcat)) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                langPack.errorMessages.invalidProcess[language],
                                resultLabel_errorColor);
                            return;
                        }
                        //#endregion

                        //#region when subcategory is already selected previously (THROW)
                        const selectedSubcat = (slct.subcategory
                            .children("option:selected")
                            .text());

                        for (let divId in selectedCatsByLangs.subcategory[language]) {
                            const OldSelectedSubCat = selectedCatsByLangs.subcategory[language][divId];

                            if (selectedSubcat == OldSelectedSubCat) {
                                // write error message
                                updateResultLabel(
                                    "#" + p_id.resultLabelForSelectBtnOnSubcat,
                                    langPack.errorMessages.conflictForSelectSubcategory[language],
                                    resultLabel_errorColor);
                                return;
                            }
                        }
                        //#endregion

                        //#endregion

                        //#region add new <input> to selected main/subcategories
                        div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
                            categoryType.subcat,
                            language);

                        inpt_newAdded = div.selectedSubcategory.find("#" + div_formGroup_id + " input");
                        //#endregion

                        //#region populate new added <input>
                        // populate <input>
                        inpt_newAdded.val(selectedSubcat);

                        // update "selectedCatsByLangs"
                        selectedCatsByLangs.subcategory[language][div_formGroup_id] = selectedSubcat;

                        // disable main category <select> on subcategory article
                        slct.mainCatOnSubcatArticle.attr("disabled", "");
                        //#endregion

                        break;
                }
                break;
        }
    })
    btn.send.click(async () => {
        resetResultLabels();

        //#region set variables
        const selectedMainCatInTRCount = getSelectedCategoryCount(categoryType.mainCat, "TR");
        const selectedMainCatInENCount = getSelectedCategoryCount(categoryType.mainCat, "EN");
        const selectedSubcatInTRCount = getSelectedCategoryCount(categoryType.subcat, "TR");
        const selectedSubcatInENCount = getSelectedCategoryCount(categoryType.subcat, "EN");
        //#endregion

        switch (mode) {
            case "add":
                //#region add main/subcategories by mode menu
                let mainCategoryInEN;
                let mainCategoryInTR;
                let subcategoriesInEN = [];
                let subcategoriesInTR = [];
                let errorMessage = null;

                switch (modeMenu) {
                    case modeMenus.add.newCat:
                        //#region security control (THROW)
                        // when any main cat and subcat is not selected
                        if (!isAnyMainCategorySelected()
                            && !isAnySubcategorySelected())
                            errorMessage = langPack.errorMessages.notAnyChanges[language];

                        // when any main category is not selected
                        else if (!isAnyMainCategorySelected())
                            errorMessage = langPack.errorMessages.anyMainCatIsNotAdded[language];

                        // when any subcategory is not selected
                        else if (!isAnySubcategorySelected())
                            errorMessage = langPack.errorMessages.anySubcatIsNotAdded[language];

                        // when counts of entered main cat by languages is not same
                        else if (selectedMainCatInTRCount != selectedMainCatInENCount)
                            errorMessage = langPack.errorMessages.mainCatCountIsNotSame[language];

                        // when counts of entered subcat by languages is not same
                        else if (selectedSubcatInTRCount != selectedSubcatInENCount)
                            errorMessage = langPack.errorMessages.subcatCountIsNotSame[language];
                       
                        // if security is failed (THROW)
                        if (errorMessage != null) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                errorMessage,
                                resultLabel_errorColor,
                                "30px",
                                img.loading);
                            return;
                        }
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
                                resetCategoryArticlesAsync();
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
                    case modeMenus.add.onlySubcat:
                        //#region security control (THROW)
                        // when any subcategory is not selected
                        if (!isAnySubcategorySelected())
                            errorMessage = langPack.errorMessages.notAnyChanges[language];
                        
                        // when counts of entered subcat by languages is not same
                        else if (selectedSubcatInTRCount != selectedSubcatInENCount)
                            errorMessage = langPack.errorMessages.subcatCountIsNotSame[language];

                        // if security is failed (THROW)
                        if (errorMessage != null) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                errorMessage,
                                resultLabel_errorColor,
                                "30px",
                                img.loading);
                            return;
                        }
                        //#endregion

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

                                resetCategoryArticlesAsync();
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
                const baseMainCategory = (modeMenu == categoryType.mainCat ?
                    slct.mainCatOnMainCatArticle.val()
                    : slct.mainCatOnSubcatArticle.val());
                let oldSubCategoriesInTR = null
                let newSubCategoriesInTR = null;

                //#region set "oldSubCategoriesInTR" and "newSubCategoriesInTR"
                if (selectedSubcatInTRCount > 0) {
                    oldSubCategoriesInTR = (await getMainAndSubcatsOfBaseMainCatByLangAsync(
                        baseMainCategory,
                        "TR"))
                        .subcategoryNames;
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
                let oldSubCategoriesInEN = (await getMainAndSubcatsOfBaseMainCatByLangAsync(
                    baseMainCategory,
                    "EN"))
                    .subcategoryNames;
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
                    url: baseApiUrl + `/machineCategory/mainAndSubcategory/update?language=${language}`,
                    headers: {
                        authorization: jwtToken
                    },
                    data: JSON.stringify({
                        OldMainCategoryInEN: baseMainCategory,
                        OldSubCategoriesInEN: oldSubCategoriesInEN,
                        OldSubCategoriesInTR: oldSubCategoriesInTR,
                        NewMainCategoryInEN: (selectedMainCatInENCount > 0 ?
                            getValuesOfObject(selectedCatsByLangs.mainCategory.EN)[0]
                            : null),
                        NewMainCategoryInTR: (selectedMainCatInTRCount > 0 ?
                            getValuesOfObject(selectedCatsByLangs.mainCategory.TR)[0]
                            : null),
                        NewSubCategoriesInEN: newSubCategoriesInEN,
                        NewSubCategoriesInTR: newSubCategoriesInTR,
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    beforeSend: () => {
                        img.loading.removeAttr("hidden");
                    },
                    success: () => {
                        // remove old main and subcats from local
                        localStorage.removeItem(localKeys_allMainAndSubcategories);

                        new Promise(async (resolve) => {
                            await resetCategoryArticlesAsync();

                            // write success message
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                langPack.successMessages.updateSuccessful[language],
                                resultLabel_successColor,
                                "30px",
                                img.loading);
                            resolve();
                        });
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
                switch (modeMenu) {
                    case modeMenus.delete.mainCat:
                        //#region security control (THROW)
                        // when any main category is not selected
                        if (!isAnyMainCategorySelected()) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                langPack.errorMessages.notAnyChanges[language],
                                resultLabel_errorColor,
                                "30px");
                            return;
                        }   
                        //#endregion

                        const selectedMainCats = getValuesOfObject(
                            selectedCatsByLangs.mainCategory[language]);
                        $.ajax({
                            method: "POST",
                            url: baseApiUrl + `/machineCategory/mainCategory/delete?language=${language}`,
                            headers: {
                                authorization: jwtToken
                            },
                            data: JSON.stringify({
                                mainCategoryInEN: selectedMainCats[0]
                            }),
                            contentType: "application/json",
                            dataType: "json",
                            beforeSend: () => {
                                img.loading.removeAttr("hidden");
                            },
                            success: () => {
                                // remove old main and subcats from local
                                localStorage.removeItem(localKeys_allMainAndSubcategories);

                                new Promise(async resolve => {
                                    await resetCategoryArticlesAsync();

                                    // write success message
                                    updateResultLabel(
                                        "#" + p_id.resultLabelForSendBtn,
                                        langPack.successMessages.deleteSuccessful[language],
                                        resultLabel_successColor,
                                        "30px",
                                        img.loading);
                                    resolve();
                                })
                            },
                            error: (response) => {
                                // write error
                                updateResultLabel(
                                    "#" + p_id.resultLabelForSendBtn,
                                    JSON.parse(response.responseText).errorMessage,
                                    resultLabel_errorColor,
                                    "30px",
                                    img.loading);
                            }
                        })

                        break;
                    case modeMenus.delete.subcat:
                        //#region security control (THROW)
                        // when any subcategory is not selected
                        if (!isAnySubcategorySelected()) {
                            updateResultLabel(
                                "#" + p_id.resultLabelForSendBtn,
                                langPack.errorMessages.notAnyChanges[language],
                                resultLabel_errorColor,
                                "30px");
                            return;
                        }
                        //#endregion

                        $.ajax({
                            method: "POST",
                            url: baseApiUrl + `/machineCategory/subcategory/delete?language=${language}`,
                            headers: {
                                authorization: jwtToken
                            },
                            data: JSON.stringify({
                                mainCategoryInEN: slct.mainCatOnSubcatArticle.val(),
                                subcategories: getValuesOfObject(selectedCatsByLangs.subcategory[language])
                            }),
                            contentType: "application/json",
                            dataType: "json",
                            beforeSend: () => {
                                img.loading.removeAttr("hidden");
                            },
                            success: () => {
                                // remove all saved main and subcategories from local (for refresh categories)
                                localStorage.removeItem(localKeys_allMainAndSubcategories);

                                new Promise(async resolve => {
                                    await resetCategoryArticlesAsync();

                                    // write success message
                                    updateResultLabel(
                                        "#" + p_id.resultLabelForSendBtn,
                                        langPack.successMessages.deleteSuccessful[language],
                                        resultLabel_successColor,
                                        "30px",
                                        img.loading);
                                    resolve();
                                })
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
                }
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

        populateModeMenusSelect();
        //#endregion

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

        //#region populate info messages on menubar
        for (let index in langPack.infoMessages.menubar[language]) {
            let infoMessage = langPack.infoMessages.menubar[language][index];

            ul.menubarInfoMessage.append(`<li>${infoMessage}</li>`)
        }
        //#endregion
    }
    async function initializeMainAndSubcategoriesSelectAsync() {
        // get all main and subcategories
        categoryInfos = await getDataByAjaxOrLocalAsync(
            localKeys_allMainAndSubcategories,
            "/machineCategory/mainAndSubcategory/display/all",
            false,
            true);

        await populateMainAndSubcatsSelectAsync(categoryLanguage);
    }
    async function populateMainAndSubcatsSelectAsync(
        desiredLanguage,
        mainCatToBeDisplayInMainCatArticle = null,
        mainCatToBeDisplayInSubcatArticle = null,
    ) {
        //#region *** FEATURES OF FUNC ***
        // 1) it resets all main / sub category <select>'s
        // 2) it populates all main category <select>'s and it adds default value to
        //    main category <select>'s (select type is optional) 
        // 3) it populates subcategory <select> by displayed main category
        //#endregion

        //#region reset main cat <select>'s
        slct.mainCatOnMainCatArticle.empty();
        slct.mainCatOnSubcatArticle.empty();
        //#endregion

        //#region populate main cat <select>'s on main/subcat article
        let subCatsOfDisplatedMainCat = null;

        for (let index in categoryInfos) {
            //#region set variables
            const categoryInfo = categoryInfos[index];
            const mainAndSubCatsByLang = (categoryInfo
                .mainAndSubcatsByLangs
                .find(m => m.language == desiredLanguage));
            const option = `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubCatsByLang.mainCategoryName}</option>`;
            //#endregion

            //#region populate <select>'s
            slct.mainCatOnMainCatArticle.append(option);
            slct.mainCatOnSubcatArticle.append(option);
            //#endregion

            //#region save subcategories
            // when desired main cat to be display is in subcat article
            if (mainCatToBeDisplayInSubcatArticle != null
                && categoryInfo.baseMainCategoryName == mainCatToBeDisplayInSubcatArticle) {
                subCatsOfDisplatedMainCat = mainAndSubCatsByLang.subcategoryNames;
            }

            // when any main cat is not desired for display or desired main cat to be display is in main cat article
            else if (subCatsOfDisplatedMainCat == null
                && mainCatToBeDisplayInMainCatArticle == null
                && mainCatToBeDisplayInSubcatArticle == null)
                // save subcats of first added main category
                subCatsOfDisplatedMainCat = mainAndSubCatsByLang.subcategoryNames;
            //#endregion
        }
        //#endregion

        //#region add default value to main cat <select>'s
        // for main cat <select> in main cat article
        if (mainCatToBeDisplayInMainCatArticle != null)
            slct.mainCatOnMainCatArticle.val(mainCatToBeDisplayInMainCatArticle);

        // for main cat <select> in subcat article
        if (mainCatToBeDisplayInSubcatArticle != null)
            slct.mainCatOnSubcatArticle.val(mainCatToBeDisplayInSubcatArticle);
        //#endregion

        await populateSelectAsync(
            slct.subcategory,
            subCatsOfDisplatedMainCat,
            null,
            true);  // populate subcategory <select>
    }
    async function populateSubcatSelectByBaseMainCatAsync(baseMainCategory, language) {
        const mainAndSubcatsByLang = await getMainAndSubcatsOfBaseMainCatByLangAsync(
            baseMainCategory,
            language);

        await populateSelectAsync(
            slct.subcategory,
            mainAndSubcatsByLang.subcategoryNames,
            null,
            true);
    }
    async function addNewInputToSelectedInputsAreaAsync(whichCategory, language) {
        //#region set "div_selectedCatsByLang"
        let div_selectedCats = (whichCategory == categoryType.mainCat ?
            div.selectedMainCategory
            : div.selectedSubcategory);
        let div_selectedCatsOfLang_id = div_selectedCats.attr("class") + "_" + language;  // EX: "div_selectedCategories" + "_" + "EN" => "div_selectedCategories_EN"

        //#region when any main/subcat belong to desired language is not selected
        if ((mode == "add" && whichCategory == categoryType.mainCat && !isAnyMainCategorySelectedByLanguage(categoryLanguage))
            || (mode == "add" && whichCategory == categoryType.subcat && !isAnySubcategorySelectedByLanguage(categoryLanguage))
            || (mode == "update" && whichCategory == categoryType.mainCat && !isAnyMainCategorySelectedByLanguage(categoryLanguage))
            || (mode == "update" && whichCategory == categoryType.subcat && !isAnySubcategorySelectedByLanguage(categoryLanguage))
            || (mode == "delete" && whichCategory == categoryType.mainCat && !isAnyMainCategorySelectedByLanguage(language))
            || (mode == "delete" && whichCategory == categoryType.subcat && !isAnySubcategorySelectedByLanguage(language))
        ) {
            // add article belong to selected language
            div_selectedCats.append(`
                <div id="${div_selectedCatsOfLang_id}" class="div_selectedCategoriesByLang">
                    <h4>${categoryLanguage}</h4>
                </div>`);

            // hide language title if mode delete
            if (mode == "delete")
                div_selectedCats
                    .find("#" + div_selectedCatsOfLang_id + " h4")
                    .css("display", "none");
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
                        <img src="/images/cancel.png" alt="remove" title="remove"/>
                    </button>
                </div>
            </div>`);
        //#endregion

        return div_newAddedInput_id;
    }
    async function removeSelectedInputAsync(whichCategory, clickedElement) {
        //#region remove selected main/subcategory from "selectedCatsByLangs"
        const div_formGroupOfCancelButton = clickedElement.closest("div[class= 'form-group']");
        const mainCategory = div_formGroupOfCancelButton.attr("value");
        const titleOfSelectedCategory = (div_formGroupOfCancelButton
            .siblings("h4")
            .text());  // category language

        switch (mode) {
            case "add":
                delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][div_formGroupOfCancelButton.attr("id")];

                // show select <button> on main cat article
                if (modeMenu == modeMenus.add.newCat)
                    btn.selectOnMainCat.removeAttr("disabled");

                break;
            case "update":
                delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][mainCategory];

                // show/hide elements in the relevant article
                if (modeMenu == modeMenus.update.mainCat) {
                    // show main category <select>
                    slct.mainCatOnMainCatArticle.removeAttr("disabled");

                    // show select <button> on main cat article
                    btn.selectOnMainCat.removeAttr("disabled");
                }

                break;
            case "delete":
                delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][div_formGroupOfCancelButton.attr("id")];

                // show select <button> on main cat article
                if (modeMenu == modeMenus.delete.mainCat)
                    btn.selectOnMainCat.removeAttr("disabled");

                break;
        }

        // show main category <select> on subcat article
        if ((mode == "add" && modeMenus.add.onlySubcat
            || mode == "update" && modeMenus.update.subcat
            || mode == "delete" && modeMenus.delete.subcat)
            && !isAnySubcategorySelected()
        ) {
            slct.mainCatOnSubcatArticle.removeAttr("disabled");
            oldSelectedBaseMainCat = "";  // reset
        }
        //#endregion

        //#region remove selected main/subcategory <input>
        // when any main/sub category of selected language is not exists  (remove article of selected language)
        if (getSelectedCategoryCount(whichCategory, titleOfSelectedCategory) == 0)
            div_formGroupOfCancelButton
                .parent()
                .remove();

        // when any main/sub category is exists (remove only selected main/sub category)
        else
            div_formGroupOfCancelButton.remove();
        //#endregion
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
                : div.mainCatSelectOnMainCatArticle.attr("hidden", ""));  // hide

            // show/hide new maincategory <input>
            _ = (mainCategoryArticle.showNewMainCatInput ?
                div.newMainCategoryInput.removeAttr("hidden")  // show
                : div.newMainCategoryInput.attr("hidden", ""));  // hide
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
    async function resetCategoryArticlesAsync() {
        //#region reset <input>'s and main cat <select>'s
        inpt.newMainCategory.val("");
        inpt.newSubcategory.val("");
        slct.mainCatOnMainCatArticle.prop("selectedIndex", 0);
        slct.mainCatOnSubcatArticle.prop("selectedIndex", 0);
        //#endregion

        //#region reset subcategory <select> by mode
        // add subcategories by page language
        if (mode == "delete")
            await populateSubcatSelectByBaseMainCatAsync(
                slct.mainCatOnSubcatArticle.val(),
                language);

        // add subcategories by category language
        else
            await populateSubcatSelectByBaseMainCatAsync(
                slct.mainCatOnSubcatArticle.val(),
                categoryLanguage);
        //#endregion

        //#region reset selected main/subcategory area and buffers
        div.selectedCategories.empty();

        // reset "selectedCatsByLangs"
        for (let categoryType in { mainCategory: "", subcategory: "" })
            for (let language in selectedCatsByLangs[categoryType]) selectedCatsByLangs[categoryType][language] = {};

        oldSelectedBaseMainCat = "";
        //#endregion

        //#region show main category <select>'s and select <button>'s
        slct.mainCatOnMainCatArticle.removeAttr("disabled");
        slct.mainCatOnSubcatArticle.removeAttr("disabled");
        btn.selectOnMainCat.removeAttr("disabled");
        btn.selectOnSubCat.removeAttr("disabled");
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
    function isAnyMainCategorySelectedByLanguage(language) {
        return getSelectedCategoryCount(categoryType.mainCat, language) > 0;
    }
    function isAnySubcategorySelected() {
        // control selected subcategories in all languages
        for (let catLanguage in selectedCatsByLangs.subcategory)
            if (getSelectedCategoryCount(categoryType.subcat, catLanguage) > 0)
                return true;

        return false;
    }
    function isAnySubcategorySelectedByLanguage(language) {
        return getSelectedCategoryCount(categoryType.subcat, language) > 0;
    }
    function isDifferentMainCategorySelected(whichArticle) {
        //#region initialize "oldSelectedBaseMainCat" if required
        const selectedBaseMainCat = (whichArticle == articleType.mainCat ?
            slct.mainCatOnMainCatArticle.val()
            : slct.mainCatOnSubcatArticle.val());

        if (oldSelectedBaseMainCat == "")
            oldSelectedBaseMainCat = selectedBaseMainCat;
        //#endregion

        return selectedBaseMainCat != oldSelectedBaseMainCat;
    }
    //#endregion

    setupPageAsync();
});