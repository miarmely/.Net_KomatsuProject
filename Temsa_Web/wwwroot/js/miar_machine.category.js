import {
    getDataByAjaxOrLocalAsync, populateSelectAsync,
    updateElementText
} from "./miar_tools.js";


$(function () {
    //#region variables
    const slct = {
        modes: $("#div_category_menubar select:nth-child(1)"),
        languages: $("#div_category_menubar select:nth-child(2)"),
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
    let mode = "add";  // add | update | delete
    let categoryLanguage = language;  // page language as default
    let isCategoriesPopulatedToSelects = false;
    let selectedMainCatsByLangs = {
        TR: {},
        EN: {}
    };
    let selectedSubcatsByLangs = {
        TR: {},
        EN: {}
    };
    let nextDivNos = {
        mainCat: 0,
        subCat: 0
    };  // for id of selected main/subcategory inputs
    //#endregion

    //#region events
    slct.modes.change(async () => {
        resetCategoryArticles();

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

                //#region populate categories <select>s if not populeted
                if (!isCategoriesPopulatedToSelects)
                    await populateMainAndSubcategoriesSelectAsync();
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

                //#region populate categories <select>s if not populeted
                if (!isCategoriesPopulatedToSelects)
                    await populateMainAndSubcategoriesSelectAsync();
                //#endregion

                break;
        }
        //#endregion
    })
    btn.selectOnMainCat.click(async () => {
        //#region when any value is not entered
        const newMainCategory = inpt.newMainCategory.val();

        if (newMainCategory.length == 0)
            return;
        //#endregion

        //#region if main category is selected when another main category already exists
        if (Object
            .keys(selectedMainCatsByLangs[categoryLanguage])
            .length > 0)
            return;
        //#endregion

        //#region add new input to selected maincategories area
        const div_formGroup_id = await addNewInputToSelectedInputsAreaAsync(
            div.selectedMainCategory,
            "mainCategory");

        const inpt_formGroupDiv = $("#" + div_formGroup_id + " input");
        //#endregion

        switch (mode) {
            case "add":
                //#region populate new added <input>
                selectedMainCatsByLangs[categoryLanguage][div_formGroup_id] = newMainCategory;
                inpt_formGroupDiv.val(newMainCategory);

                // disable select button
                btn.selectOnMainCat.attr("disabled", "");
                //#endregion

                break;
            case "update":
                break;
            case "delete":
                break;
        }
    })
    div.selectedMainCategory.on("click", ".btn_cancel", (event) => {
        //#region remove selected mainCategory from "selectedMainCatsByLangs"
        let clickedElement = $(event.target);
        let div_formGroup = clickedElement.closest("div[class= 'form-group']");

        delete selectedMainCatsByLangs[categoryLanguage][div_formGroup.attr("id")];
        //#endregion

        //#region remove selected main category and show select <button>
        div_formGroup.remove();
        btn.selectOnMainCat.removeAttr("disabled");
        //#endregion
    });
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

        //#region populate languages <select>
        var allLanguages = await getDataByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            false);

        await populateSelectAsync(
            slct.languages,
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
    async function populateMainAndSubcategoriesSelectAsync() {
        //#region get all main and subcategories
        // reset <select>s
        slct.mainCategory.empty();
        slct.subcategory.empty();

        const allMainAndSubcategories = await getDataByAjaxOrLocalAsync(
            localKeys_allMainAndSubcategories,
            "/machineCategory/mainAndSubcategory/display/all",
            false,
            true);
        //#endregion

        //#region populate main and subcategory <select>s
        let subCatsOfFirstAddedMainCat = null;

        for (let index in allMainAndSubcategories) {
            let categoryInfo = allMainAndSubcategories[index];
            let selectedCatLang = slct.languages.val();

            // populate main category <select> bt selected category language
            if (categoryInfo.language == selectedCatLang) {
                // populate
                slct.mainCategory.append(
                    `<option>${categoryInfo.mainCategoryName}</option>`);

                // save subcategory of first added main category
                if (subCatsOfFirstAddedMainCat == null)
                    subCatsOfFirstAddedMainCat = categoryInfo.subCategoryNames;
            }
        }
        //#endregion

        //#region populate subcategory <select> with subcategories of displaying main category
        await populateSelectAsync(
            slct.subcategory,
            subCatsOfFirstAddedMainCat);

        isCategoriesPopulatedToSelects = true;
        //#endregion
    }
    async function addNewInputToSelectedInputsAreaAsync(div_parent, whichCategory) {
        //#region set next div no
        let nextDivNo;

        switch (whichCategory) {
            case "mainCategory":
                nextDivNo = nextDivNos.mainCat;
                nextDivNos.mainCat += 1;
                break;
            case "subCategory":
                nextDivNo = nextDivNos.subCat;
                nextDivNos.subCat += 1;
                break;
        }
        //#endregion

        //#region add new input to selected main/subcategory inputs area
        let div_id = "div_" + nextDivNo;

        div_parent.append(
            `<div id="${div_id}" class="form-group" style="margin-bottom: 0px">
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

        return div_id;
    }
    function resetCategoryArticles() {
        // reset <select> and <input> of main category article
        slct.mainCategory.prop("selectedIndex", 0);
        inpt.newMainCategory.val("");

        // reset <select> and <input> of subcategory article
        slct.subcategory.prop("selectedIndex", 0);
        inpt.newSubcategory.val("");
    }
    //#endregion

    setupPageAsync();
});