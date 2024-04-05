import { getDataByAjaxOrLocalAsync, populateSelectAsync } from "./miar_tools.js";


$(function () {
    //#region variables
    const slct = {
        modes: $("#div_category_menubar select:nth-child(1)"),
        languages: $("#div_category_menubar select:nth-child(2)"),
        mainCategory: $("#slct_mainCategory"),
        subcategory: $("#slct_subCategory"),
    };
    const h = {
        mainCategoryTitle: $(".div_category:nth-child(1) .h_articleTitle"),
        subcategoryTitle: $(".div_category:nth-child(2) .h_articleTitle"),
    };
    const div = {
        selectButton: $(".div_articleButton button")
    };
    const btn = {
        send: $("#div_sendButton button")
    };
    let mode = "add";  // add | update | delete
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
            "/machine/display/language");

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
        $("#lbl_mainCategory").append(
            langPack.article.mainCategoryLabel[language]);
        //#endregion

        //#region populate subcategory article
        // add title
        h.subcategoryTitle.append(
            langPack.article.subcategoryTitleByMode[mode][language]);

        // add label name
        $("#lbl_subcategory").append(
            langPack.article.subcategoryLabel[language]);
        //#endregion

        //#region add name to select <button>s
        div.selectButton.append(
            langPack.article.selectButton[language]);
        //#endregion

        btn.send.append(langPack.sendButton[language]);
    }
    //#endregion

    setupPageAsync();
});