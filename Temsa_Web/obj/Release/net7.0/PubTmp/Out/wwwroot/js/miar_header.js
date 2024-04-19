import { getDataByAjaxOrLocalAsync } from "./miar_tools.js";


export async function populateLanguageDropdownAsync(ul_languages) {
    let allLanguages = await getDataByAjaxOrLocalAsync(
        localKeys_allLanguages,
        "/machine/display/language",
        false,
        false);

    //#region add languages to dropdown
    for (let index in allLanguages) {
        let language = allLanguages[index];

        $(ul_languages).append(
            `<li>
                <a href="#">
                    <img alt="${language}" src="/images/${language}.png" style="width:40px; height:40px"/>
                    <b>${language}</b>
                </a>
            </li>`
        );
    }
    //#endregion
}
export function updateDefaultFlagAndLanguage(img_flag_id, spn_language_id) {
    //#region add flag
    $("#" + img_flag_id).attr("alt", language);
    $("#" + img_flag_id).attr("src", `/images/${language}.png`);
    //#endregion

    //#region add language
    $("#" + spn_language_id).text(language);
    //#endregion
}
export function clicked_languageDropdown(selectedElement) {
    //#region change language on language dropdown
    let selectedLanguage = selectedElement.prop("innerText");

    if (selectedLanguage != undefined) {
        //#region update language in local
        language = selectedLanguage.trim() // update in layout
        localStorage.setItem("language", language)  // update in local
        //#endregion

        //#region update default flag and language and refresh page
        updateDefaultFlagAndLanguage(
            img_displayingFlag_id,
            spn_displayingLanguage_id);

        location.reload();
        //#endregion
    }
    //#endregion
}