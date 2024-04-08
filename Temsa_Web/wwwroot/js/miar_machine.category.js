import {
    getDataByAjaxOrLocalAsync, populateSelectAsync, updateElementText, updateResultLabel
} from "./miar_tools.js";


$(function () {
    //#region variables
    const slct = {
        modes: $("#div_category_menubar select:nth-child(1)"),
        categoryLanguage: $("#div_category_menubar .slct_categoryLanguage"),
        mainCategory: $("#slct_mainCategory"),
        subcategory: $("#slct_subcategory"),
    };
    const h = {
        mainCategoryTitle: $(".div_category:nth-child(1) .h_articleTitle"),
        subcategoryTitle: $(".div_category:nth-child(2) .h_articleTitle"),
    };
    const div = {
        mainCategorySelect: $("label[for='slct_mainCategory']").parent(),
        newMainCategoryInput: $("label[for='inpt_newMainCategory']").parent(),
        subcategorySelect: $("label[for='slct_subcategory']").parent(),
        newSubcategoryInput: $("label[for='inpt_newSubcategory']").parent(),
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
    const p_resultLabel = $("#p_resultLabel");
    const img = {
        loading: $("#img_loading")
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
    //#endregion

    //#region events
    slct.modes.change(async () => {
        //#region resets
        resetCategoryArticles();
        p_resultLabel.empty();
        //#endregion

        //#region change article title of main and subcategory
        mode = slct.modes.val();

        updateElementText(
            h.mainCategoryTitle,
            langPack.article.mainCategoryTitleByMode[mode][language])  // main category article
        updateElementText(
            h.subcategoryTitle,
            langPack.article.subcategoryTitleByMode[mode][language])  // subcategory article
        //#endregion

        //#region hide or show <input> and <select> of categories
        switch (mode) {
            case "add":
                //#region hide <select>; show <input> of main category
                div.mainCategorySelect.attr("hidden", "");
                div.newMainCategoryInput.removeAttr("hidden");
                //#endregion

                //#region hide <select>; show <input> of subcategory
                div.subcategorySelect.attr("hidden", "");
                div.newSubcategoryInput.removeAttr("hidden");
                //#endregion

                break;
            case "update":
                //#region show <input> and <select> of main category
                div.mainCategorySelect.removeAttr("hidden");
                div.newMainCategoryInput.removeAttr("hidden");
                //#endregion

                //#region show <input> and <select> of subcategory
                div.subcategorySelect.removeAttr("hidden");
                div.newSubcategoryInput.removeAttr("hidden");
                //#endregion

                //#region populate categories <select>s if not populated
                if (!isCategoriesPopulatedToSelects)
                    await initializeMainAndSubcategoriesSelectAsync();
                //#endregion

                break;
            case "delete":
                //#region hide <input>; show <select> of main category
                div.newMainCategoryInput.attr("hidden", "");
                div.mainCategorySelect.removeAttr("hidden");
                //#endregion

                //#region hide <input>; show <select> of subcategory
                div.newSubcategoryInput.attr("hidden", "");
                div.subcategorySelect.removeAttr("hidden");
                //#endregion

                //#region populate categories <select>s if not populated
                if (!isCategoriesPopulatedToSelects)
                    await initializeMainAndSubcategoriesSelectAsync();
                //#endregion

                break;
        }
        //#endregion
    })
    slct.categoryLanguage.change(async () => {
        categoryLanguage = slct.categoryLanguage.val();  // update

        //#region main category control
        // show select <button> when any selected main category of selected category language is not exists 
        if (getSelectedCategoryCount("mainCategory", categoryLanguage) == 0)
            btn.selectOnMainCat.removeAttr("disabled");

        // disable select <button> (otherwise)
        else
            btn.selectOnMainCat.attr("disabled", "");
        //#endregion

        //#region populate main and subcategories
        if (mode != "add")
            await populateMainAndSubcatsSelectAsync(categoryInfos);
        //#endregion
    })
    slct.mainCategory.change(async () => {
        //#region populate subcategory <select> by selected main category
        if (mode != "add") {
            //#region set variables
            let baseMainCatNameOfSelectedMainCat = slct.mainCategory.val();
            let categoryInfoOfSelectedMainCat = categoryInfos.find(c =>
                c.baseMainCategoryName == baseMainCatNameOfSelectedMainCat);
            let mainAndSubcatsBySelectedLang = (categoryInfoOfSelectedMainCat
                .mainAndSubcatsByLangs
                .find(m => m.language == categoryLanguage));
            //#endregion

            await populateSelectAsync(
                slct.subcategory,
                mainAndSubcatsBySelectedLang.subcategoryNames,
                null,
                true);
        }
        //#endregion
    })
    btn.selectOnMainCat.click(async () => {
        p_resultLabel.empty();
        await selectCategoryAsync("mainCategory");
    })
    btn.selectOnSubCat.click(async () => {
        p_resultLabel.empty();
        await selectCategoryAsync("subcategory");
    })
    btn.send.click((event) => {
        //#region resets
        event.preventDefault();
        p_resultLabel.empty();
        //#endregion

        //#region security control

        //#region check selected main categories whether is entered for all languages
        let selectedMainCatInTRCount = getSelectedCategoryCount("mainCategory", "TR");
        let selectedMainCatInENCount = getSelectedCategoryCount("mainCategory", "EN");

        if (selectedMainCatInTRCount == 0
            || selectedMainCatInTRCount != selectedMainCatInENCount
        ) {
            // write error message
            updateResultLabel(
                "#" + p_resultLabel.attr("id"),
                langPack.errorMessages.badRequestForMainCat[language],
                resultLabel_errorColor,
                "30px",
                img.loading);

            return;
        }
        //#endregion

        //#region check selected subcategories whether is entered for all languages
        let selectedSubcatInTRCount = getSelectedCategoryCount("subcategory", "TR");
        let selectedSubcatInENCount = getSelectedCategoryCount("subcategory", "EN");

        if (selectedSubcatInTRCount == 0
            || selectedSubcatInTRCount != selectedSubcatInENCount
        ) {
            // write error message
            updateResultLabel(
                "#" + p_resultLabel.attr("id"),
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
                    "#" + p_resultLabel.attr("id"),
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
                    "#" + p_resultLabel.attr("id"),
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img.loading);
            }
        })
    })
    div.selectedMainCategory.on("click", ".btn_cancel", async (event) => {
        p_resultLabel.empty();
        await removeSelectedInputAsync("mainCategory", $(event.target));
    })
    div.selectedSubcategory.on("click", ".btn_cancel", async (event) => {
        p_resultLabel.empty();
        await removeSelectedInputAsync("subcategory", $(event.target));
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

        //#region populate modes <select>
        for (let mode in langPack.modes) {
            let modeNameByLanguage = langPack.modes[mode][language];

            slct.modes.append(
                `<option value="${mode}">${modeNameByLanguage}</option>`);
        }
        //#endregion

        //#region populate category language <select>
        var allLanguages = await getDataByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            false);

        await populateSelectAsync(
            slct.categoryLanguage,
            allLanguages,
            language);
        //#endregion

        //#region populate main category article
        // add title
        h.mainCategoryTitle.append(
            langPack.article.mainCategoryTitleByMode[mode][language]);

        // add label name
        $("label[for= 'slct_mainCategory']").append(
            langPack.article.mainCategoryLabel.select[language]);
        $("label[for= 'inpt_newMainCategory']").append(
            langPack.article.mainCategoryLabel.input[language]);
        //#endregion

        //#region populate subcategory article
        // add title
        h.subcategoryTitle.append(
            langPack.article.subcategoryTitleByMode[mode][language]);

        // add label name
        $("label[for= 'slct_subcategory']").append(
            langPack.article.subcategoryLabel.select[language]);  // select 
        $("label[for= 'inpt_newSubcategory']").append(
            langPack.article.subcategoryLabel.input[language]);  // input
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
    async function populateMainAndSubcatsSelectAsync(categoryInfos) {
        // before start
        slct.mainCategory.empty();
        let subCatsOfFirstAddedMainCat = null;
        
        // populate main category <select>
        for (let index in categoryInfos) {
            //#region set variables
            let categoryInfo = categoryInfos[index];
            let mainAndSubCatsByLang = categoryInfo.mainAndSubcatsByLangs.find(m =>
                m.language == categoryLanguage);
            //#endregion

            // populate
            slct.mainCategory.append(
                `<option value="${categoryInfo.baseMainCategoryName}">${mainAndSubCatsByLang.mainCategoryName}</option>`);

            // save subcategories of first added main category
            if (subCatsOfFirstAddedMainCat == null) {
                subCatsOfFirstAddedMainCat = mainAndSubCatsByLang.subcategoryNames;
            }
        }

        // populate subcategory <select> by displaying main category
        await populateSelectAsync(
            slct.subcategory,
            subCatsOfFirstAddedMainCat,
            null,
            true);
    }
    async function selectCategoryAsync(whichCategory) {
        //#region set variables
        const slct_category = (whichCategory == "mainCategory" ?
            slct.mainCategory
            : slct.subcategory);
        const inpt_newCategory = (whichCategory == "mainCategory" ?
            inpt.newMainCategory
            : inpt.newSubcategory);
        const div_selectedCategories = (whichCategory == "mainCategory" ?
            div.selectedMainCategory
            : div.selectedSubcategory);
        const newCategory = inpt_newCategory.val();
        const categoryOnSelect = slct_category.val();
        //#endregion

        //#region security control
        // when mode is "add" or "update" and any value is not entered
        if (mode != "delete"
            && newCategory.length == 0)
            return;
       
        // control of "mainCategory"
        if (whichCategory == "mainCategory") {
            // if main category is alreay exists when new main category is selected
            if (getSelectedCategoryCount(whichCategory, categoryLanguage) > 0)
                return;

            btn.selectOnMainCat.attr("disabled", "");
        }
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
                // populate new added <input>
                inpt_newAdded.val(categoryOnSelect + "  ~>  " + newCategory);

                // reset new main/sub category <input>
                inpt_newCategory.val("");

                // update "selectedCatsByLangs"
                selectedCatsByLangs[whichCategory][categoryLanguage][div_formGroup_id] = newCategory;

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
        let div_selectedCats = (whichCategory == "mainCategory" ?
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
        //#region remove selected main/sub Category from "selectedMainCatsByLangs"
        let div_inputOfCancelButton = clickedElement.closest("div[class= 'form-group']");
        let titleOfSelectedCategory = (div_inputOfCancelButton
            .siblings("h4")
            .text());  // category language

        delete selectedCatsByLangs[whichCategory][titleOfSelectedCategory][div_inputOfCancelButton.attr("id")];
        //#endregion

        //#region remove selected main category <input>
        // when any main/sub category of selected language is not exists (remove article of selected language)
        if (getSelectedCategoryCount(whichCategory, titleOfSelectedCategory) == 0)
            div_inputOfCancelButton
                .parent()
                .remove();

        // when any main/sub category is exists (remove only selected main/sub category)
        else
            div_inputOfCancelButton.remove();
        //#endregion

        //#region show select <button> of main category when any selected main category of selected category langage is not exists
        if (whichCategory == "mainCategory"
            && getSelectedCategoryCount(whichCategory, categoryLanguage) == 0)
            btn.selectOnMainCat.removeAttr("disabled");
        //#endregion
    }
    function getSelectedCategoryCount(whichCategory, categoryLanguage) {
        return Object
            .keys(selectedCatsByLangs[whichCategory][categoryLanguage])
            .length;
    }
    function resetCategoryArticles() {
        //#region reset <select> and <input> of main category article
        slct.mainCategory.prop("selectedIndex", 0);
        inpt.newMainCategory.val("");
        //#endregion

        //#region reset <select> and <input> of subcategory article
        slct.subcategory.prop("selectedIndex", 0);
        inpt.newSubcategory.val("");
        //#endregion

        //#region reset selected main and subcategory
        div.selectedCategories.empty();

        // reset "selectedCatsByLangs"
        for (let language in selectedCatsByLangs.mainCategory) selectedCatsByLangs.mainCategory[language] = {};
        for (let language in selectedCatsByLangs.subcategory) selectedCatsByLangs.subcategory[language] = {};
        //#endregion

        //#region show select <button>s
        btn.selectOnMainCat.removeAttr("disabled");
        btn.selectOnSubCat.removeAttr("disabled");
        //#endregion
    }
    //#endregion

    setupPageAsync();
});